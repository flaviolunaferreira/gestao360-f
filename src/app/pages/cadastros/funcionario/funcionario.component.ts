import { Component, OnInit, inject, signal } from '@angular/core';
import { FuncionarioService } from '../../../service/cadastro/Funcionario/Funcionario.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Funcionario, CreateFuncionarioDTO, UpdateFuncionarioDTO } from '../../../interface/cadastro/Funcionario';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss']
})
export class FuncionarioComponent implements OnInit {
  private funcionarioService = inject(FuncionarioService);
  private fb = inject(FormBuilder);

  funcionarios = signal<Funcionario[]>([]);
  loading = signal(false);
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);

  funcionarioForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
    cargo: ['', [Validators.required, Validators.maxLength(50)]],
    dataAdmissao: ['', Validators.required]
  });

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  async loadFuncionarios() {
    this.loading.set(true);
    try {
      this.funcionarioService.getAll().subscribe(funcionarios => {
        this.funcionarios.set(funcionarios);
      });
    } catch (error) {
      this.showError('Erro ao carregar funcionários');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(funcionario: Funcionario) {
    this.currentEditId.set(funcionario.id);
    this.isEditing.set(true);
    this.funcionarioForm.patchValue({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      telefone: funcionario.telefone,
      cargo: funcionario.cargo,
      dataAdmissao: new Date(funcionario.dataAdmissao).toISOString().split('T')[0]
    });
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.funcionarioForm.reset();
  }

  async onSubmit() {
    if (this.funcionarioForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.funcionarioForm.value;
      const funcionarioData = {
        ...formData,
        dataAdmissao: new Date(formData.dataAdmissao!)
      };

      if (this.isEditing() && this.currentEditId()) {
        await this.funcionarioService.update(this.currentEditId()!, funcionarioData as UpdateFuncionarioDTO);
        this.showSuccess('Funcionário atualizado com sucesso');
      } else {
        await this.funcionarioService.create(funcionarioData as CreateFuncionarioDTO);
        this.showSuccess('Funcionário criado com sucesso');
      }

      this.cancelEdit();
      this.loadFuncionarios();
    } catch (error) {
      this.showError('Erro ao salvar funcionário');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteFuncionario(id: string) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await this.funcionarioService.delete(id);
        this.showSuccess('Funcionário excluído com sucesso');
        this.loadFuncionarios();
      } catch (error) {
        this.showError('Erro ao excluir funcionário');
      }
    }
  }

  private showSuccess(message: string) {
    this.toast.show(message, 'Sucesso!');
  }

  private showError(message: string) {
    this.toast.show(message, 'Erro!');
  }
}