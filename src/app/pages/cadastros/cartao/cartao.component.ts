import { Component, OnInit, inject, signal } from '@angular/core';
import { CartaoService } from '../../../service/cadastro/Cartao/Cartao.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cartao, CreateCartaoDTO, UpdateCartaoDTO } from '../../../interface/cadastro/Cartao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cartao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.scss']
})
export class CartaoComponent implements OnInit {
  private cartaoService = inject(CartaoService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  cartoes = signal<Cartao[]>([]);
  loading = signal(false);
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);

  cartaoForm = this.fb.group({
    numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    bandeira: ['', Validators.required],
    tipo: ['', Validators.required],
    dataValidade: ['', Validators.required],
    titular: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadCartoes();
  }

  async loadCartoes() {
    this.loading.set(true);
    try {
      this.cartaoService.getAll().subscribe(cartoes => {
        this.cartoes.set(cartoes);
      });
    } catch (error) {
      this.showError('Erro ao carregar cartões');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(cartao: Cartao) {
    this.currentEditId.set(cartao.id);
    this.isEditing.set(true);
    this.cartaoForm.patchValue({
      numero: cartao.numero,
      bandeira: cartao.bandeira,
      tipo: cartao.tipo,
      dataValidade: new Date(cartao.dataValidade).toISOString().split('T')[0],
      titular: cartao.titular
    });
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.cartaoForm.reset();
  }

  async onSubmit() {
    if (this.cartaoForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.cartaoForm.value;
      const cartaoData = {
        ...formData,
        dataValidade: new Date(formData.dataValidade!)
      };

      if (this.isEditing() && this.currentEditId()) {
        await this.cartaoService.update(this.currentEditId()!, cartaoData as UpdateCartaoDTO);
        this.showSuccess('Cartão atualizado com sucesso');
      } else {
        await this.cartaoService.create(cartaoData as CreateCartaoDTO);
        this.showSuccess('Cartão criado com sucesso');
      }

      this.cancelEdit();
      this.loadCartoes();
    } catch (error) {
      this.showError('Erro ao salvar cartão');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCartao(id: string) {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
      try {
        await this.cartaoService.delete(id);
        this.showSuccess('Cartão excluído com sucesso');
        this.loadCartoes();
      } catch (error) {
        this.showError('Erro ao excluir cartão');
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