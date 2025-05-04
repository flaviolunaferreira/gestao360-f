import { Component, OnInit, inject, signal } from '@angular/core';
import { ProdutoService } from '../../../service/cadastro/produto/Produto.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Produto, CreateProdutoDTO, UpdateProdutoDTO } from '../../../interface/cadastro/Produto';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private fb = inject(FormBuilder);

  produtos = signal<Produto[]>([]);
  loading = signal(false);
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);

  produtoForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    codigo: ['', [Validators.required, Validators.maxLength(50)]],
    preco: [0, [Validators.required, Validators.min(0)]],
    estoque: [0, [Validators.required, Validators.min(0)]],
    descricao: ['', Validators.maxLength(500)]
  });

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.loadProdutos();
  }

  async loadProdutos() {
    this.loading.set(true);
    try {
      this.produtoService.getAll().subscribe(produtos => {
        this.produtos.set(produtos);
      });
    } catch (error) {
      this.showError('Erro ao carregar produtos');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(produto: Produto) {
    this.currentEditId.set(produto.id);
    this.isEditing.set(true);
    this.produtoForm.patchValue({
      nome: produto.nome,
      codigo: produto.codigo,
      preco: produto.preco,
      estoque: produto.estoque,
      descricao: produto.descricao || ''
    });
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.produtoForm.reset();
  }

  async onSubmit() {
    if (this.produtoForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.produtoForm.value;

      if (this.isEditing() && this.currentEditId()) {
        await this.produtoService.update(this.currentEditId()!, formData as UpdateProdutoDTO);
        this.showSuccess('Produto atualizado com sucesso');
      } else {
        await this.produtoService.create(formData as CreateProdutoDTO);
        this.showSuccess('Produto criado com sucesso');
      }

      this.cancelEdit();
      this.loadProdutos();
    } catch (error) {
      this.showError('Erro ao salvar produto');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteProduto(id: string) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await this.produtoService.delete(id);
        this.showSuccess('Produto excluído com sucesso');
        this.loadProdutos();
      } catch (error) {
        this.showError('Erro ao excluir produto');
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