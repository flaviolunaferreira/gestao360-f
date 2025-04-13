import { Component, OnInit, inject, signal } from '@angular/core';
import { FornecedorService } from '../../../service/cadastro/Fornecedor/Fornecedor.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fornecedor, CreateFornecedorDTO, UpdateFornecedorDTO } from '../../../interface/cadastro/Fornecedor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent implements OnInit {
  private fornecedorService = inject(FornecedorService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  fornecedores = signal<Fornecedor[]>([]);
  loading = signal(false);
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);

  fornecedorForm = this.fb.group({
    razaoSocial: ['', [Validators.required, Validators.maxLength(100)]],
    cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
    endereco: ['', [Validators.required, Validators.maxLength(200)]]
  });

  ngOnInit(): void {
    this.loadFornecedores();
  }

  async loadFornecedores() {
    this.loading.set(true);
    try {
      this.fornecedorService.getAll().subscribe(fornecedores => {
        this.fornecedores.set(fornecedores);
      });
    } catch (error) {
      this.showError('Erro ao carregar fornecedores');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(fornecedor: Fornecedor) {
    this.currentEditId.set(fornecedor.id);
    this.isEditing.set(true);
    this.fornecedorForm.patchValue({
      razaoSocial: fornecedor.razaoSocial,
      cnpj: fornecedor.cnpj,
      email: fornecedor.email,
      telefone: fornecedor.telefone,
      endereco: fornecedor.endereco
    });
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.fornecedorForm.reset();
  }

  async onSubmit() {
    if (this.fornecedorForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.fornecedorForm.value;

      if (this.isEditing() && this.currentEditId()) {
        await this.fornecedorService.update(this.currentEditId()!, formData as UpdateFornecedorDTO);
        this.showSuccess('Fornecedor atualizado com sucesso');
      } else {
        await this.fornecedorService.create(formData as CreateFornecedorDTO);
        this.showSuccess('Fornecedor criado com sucesso');
      }

      this.cancelEdit();
      this.loadFornecedores();
    } catch (error) {
      this.showError('Erro ao salvar fornecedor');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteFornecedor(id: string) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await this.fornecedorService.delete(id);
        this.showSuccess('Fornecedor excluído com sucesso');
        this.loadFornecedores();
      } catch (error) {
        this.showError('Erro ao excluir fornecedor');
      }
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}