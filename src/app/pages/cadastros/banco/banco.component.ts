import { Component, OnInit, inject, signal } from '@angular/core';
import { BancoService } from '../../../service/cadastro/Banco.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Banco, CreateBancoDTO, UpdateBancoDTO } from '../../../interface/cadastro/Banco';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss']
})
export class BancoComponent implements OnInit {
  private bancoService = inject(BancoService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  bancos = signal<Banco[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);

  bancoForm = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(10)]],
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    ispb: ['', [Validators.required, Validators.maxLength(8)]]
  });

  ngOnInit(): void {
    this.loadBancos();
  }

  async loadBancos() {
    this.loading.set(true);
    try {
      this.bancoService.getAll().subscribe(bancos => {
        this.bancos.set(bancos);
      });
    } catch (error) {
      this.showError('Erro ao carregar bancos');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(banco: Banco) {
    this.currentEditId.set(banco.id);
    this.isEditing.set(true);
    this.bancoForm.patchValue({
      codigo: banco.codigo,
      nome: banco.nome,
      ispb: banco.ispb
    });
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.bancoForm.reset();
  }

  async onSubmit() {
    if (this.bancoForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.bancoForm.value;
      
      if (this.isEditing() && this.currentEditId()) {
        await this.bancoService.update(this.currentEditId()!, formData as UpdateBancoDTO);
        this.showSuccess('Banco atualizado com sucesso');
      } else {
        await this.bancoService.create(formData as CreateBancoDTO);
        this.showSuccess('Banco criado com sucesso');
      }

      this.cancelEdit();
      this.loadBancos();
    } catch (error) {
      this.showError('Erro ao salvar banco');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteBanco(id: string) {
    if (confirm('Tem certeza que deseja excluir este banco?')) {
      try {
        await this.bancoService.delete(id);
        this.showSuccess('Banco excluído com sucesso');
        this.loadBancos();
      } catch (error) {
        this.showError('Erro ao excluir banco');
      }
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fechar', { 
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}