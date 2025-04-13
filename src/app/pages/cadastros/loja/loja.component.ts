import { Component, OnInit, inject, signal } from '@angular/core';
import { LojaService } from '../../../service/cadastro/loja/Loja.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Loja, CreateLojaDTO, UpdateLojaDTO } from '../../../interface/cadastro/Loja';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loja.component.html',
  styleUrls: ['./loja.component.scss']
})
export class LojaComponent implements OnInit {
  private lojaService = inject(LojaService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  lojas = signal<Loja[]>([]);
  loading = signal(false);
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);

  lojaForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
    endereco: ['', [Validators.required, Validators.maxLength(200)]]
  });

  ngOnInit(): void {
    this.loadLojas();
  }

  async loadLojas() {
    this.loading.set(true);
    try {
      this.lojaService.getAll().subscribe(lojas => {
        this.lojas.set(lojas);
      });
    } catch (error) {
      this.showError('Erro ao carregar lojas');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(loja: Loja) {
    this.currentEditId.set(loja.id);
    this.isEditing.set(true);
    this.lojaForm.patchValue({
      nome: loja.nome,
      cnpj: loja.cnpj,
      email: loja.email,
      telefone: loja.telefone,
      endereco: loja.endereco
    });
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.lojaForm.reset();
  }

  async onSubmit() {
    if (this.lojaForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.lojaForm.value;

      if (this.isEditing() && this.currentEditId()) {
        await this.lojaService.update(this.currentEditId()!, formData as UpdateLojaDTO);
        this.showSuccess('Loja atualizada com sucesso');
      } else {
        await this.lojaService.create(formData as CreateLojaDTO);
        this.showSuccess('Loja criada com sucesso');
      }

      this.cancelEdit();
      this.loadLojas();
    } catch (error) {
      this.showError('Erro ao salvar loja');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteLoja(id: string) {
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        await this.lojaService.delete(id);
        this.showSuccess('Loja excluída com sucesso');
        this.loadLojas();
      } catch (error) {
        this.showError('Erro ao excluir loja');
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