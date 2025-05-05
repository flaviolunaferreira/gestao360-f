import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartaoService } from '../../../service/cadastro/Cartao/Cartao.service';
import { ContaCorrenteService } from '../../../service/cadastro/conta-corrente/Conta-Corrente.service';
import { Cartao, CreateCartaoDTO, UpdateCartaoDTO } from '../../../interface/cadastro/Cartao';
import { ContaCorrenteResponseDTO } from '../../../interface/cadastro/Conta-Corrente';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../service/toast/toast.service';
import * as bootstrap from 'bootstrap';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cartao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.scss']
})
export class CartaoComponent implements OnInit {

  private cartaoService = inject(CartaoService);
  private contaCorrenteService = inject(ContaCorrenteService);
  private fb = inject(FormBuilder);

  cartoes = signal<Cartao[]>([]);
  filteredCartoes = signal<Cartao[]>([]);
  paginatedCartoes = signal<Cartao[]>([]);
  contasCorrentes = signal<ContaCorrenteResponseDTO[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);
  selectedCartao = signal<Cartao | null>(null);
  sortField = signal<string>('numeroCartao');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);
  totalPages = signal<number>(1);

  cartaoForm = this.fb.group({
    numeroCartao: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    dataVencimento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/)]],
    limite: [0, [Validators.required, Validators.min(0)]],
    saldo: [0, [Validators.required, Validators.min(0)]],
    diaVencimento: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
    tipoCartao: ['CREDITO', [Validators.required, Validators.pattern(/^(CREDITO|DEBITO|CRE_DEB)$/)]],
    contaCorrenteNumero: ['', Validators.required]
  });

  tipoCartaoOptions = ['CREDITO', 'DEBITO', 'CRE_DEB'];

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.loadCartoes();
    this.loadContasCorrentes();
  }

  async loadCartoes() {
    this.loading.set(true);
    try {
      this.cartaoService.getAll().subscribe(cartoes => {
        this.cartoes.set(cartoes);
        this.filteredCartoes.set(cartoes);
        this.updatePagination();
      });
    } catch (error) {
      this.showError('Erro ao carregar cartões');
    } finally {
      this.loading.set(false);
    }
  }

  async loadContasCorrentes() {
    this.loading.set(true);
    try {
      this.contaCorrenteService.getAll().subscribe(contas => {
        this.contasCorrentes.set(contas);
      });
    } catch (error) {
      this.showError('Erro ao carregar contas correntes');
    } finally {
      this.loading.set(false);
    }
  }

  filterCartoes() {
    const term = this.searchTerm().toLowerCase();
    this.cartaoService.getAll().subscribe((cartoes: any[]) => {
      const filtered = cartoes.filter(cartao =>
        cartao.numeroCartao.toLowerCase().includes(term) ||
        cartao.dataVencimento.toLowerCase().includes(term) ||
        cartao.contaCorrenteNumero.toLowerCase().includes(term) ||
        cartao.tipoCartao.toLowerCase().includes(term)
      );
      this.filteredCartoes.set(filtered);
      this.currentPage.set(1);
      this.updatePagination();
    });
  }

  sortTable(field: string) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }

    const sortedCartoes = [...this.filteredCartoes()].sort((a, b) => {
      const valueA = a[field as keyof Cartao];
      const valueB = b[field as keyof Cartao];
      const direction = this.sortDirection() === 'asc' ? 1 : -1;

      if ((valueA ?? '') < (valueB ?? '')) return -1 * direction;
      if ((valueA ?? '') > (valueB ?? '')) return 1 * direction;
      return 0;
    });

    this.filteredCartoes.set(sortedCartoes);
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    const paginated = this.filteredCartoes().slice(start, end);
    this.paginatedCartoes.set(paginated);
    this.totalPages.set(Math.ceil(this.filteredCartoes().length / this.itemsPerPage()));
  }

  pageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxPagesToShow = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.updatePagination();
    }
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages());
  }

  onItemsPerPageChange() {
    this.currentPage.set(1);
    this.updatePagination();
  }

  startEdit(cartao: Cartao) {
    this.currentEditId.set(cartao.numeroCartao);
    this.isEditing.set(true);
    this.cartaoForm.patchValue({
      numeroCartao: cartao.numeroCartao,
      dataVencimento: cartao.dataVencimento,
      limite: cartao.limite,
      saldo: cartao.saldo,
      diaVencimento: cartao.diaVencimento,
      tipoCartao: cartao.tipoCartao,
      contaCorrenteNumero: cartao.contaCorrenteNumero
    });
  }

  showDetails(cartao: Cartao) {
    this.selectedCartao.set(cartao);
    const modal = new bootstrap.Modal(document.getElementById('detailsModal')!);
    modal.show();
  }

  cancelEdit() {
    this.currentEditId.set(null);
    this.isEditing.set(false);
    this.cartaoForm.reset({
      limite: 0,
      saldo: 0,
      diaVencimento: 1,
      tipoCartao: 'CREDITO'
    });
  }

  async onSubmit() {
    if (this.cartaoForm.invalid) {
      this.cartaoForm.markAllAsTouched();
      this.showError('Por favor, preencha todos os campos obrigatórios corretamente');
      return;
    }

    this.loading.set(true);
    try {
      const formData = this.cartaoForm.value;
      console.log('Form Data:', formData);
      if (this.isEditing() && this.currentEditId()) {
        await firstValueFrom(this.cartaoService.update(this.currentEditId()!, formData as UpdateCartaoDTO));
        this.showSuccess('Cartão atualizado com sucesso');
      } else {
        await firstValueFrom(this.cartaoService.create(formData as CreateCartaoDTO));
        this.showSuccess('Cartão criado com sucesso');
      }

      this.cancelEdit();
      await this.loadCartoes();
      const elemento = document.getElementById("numeroCartao");
      if (elemento) {
        elemento.focus();
      }
    } catch (error) {
      this.showError('Erro ao salvar cartão: ' + (error instanceof Error ? error.message : 'Tente novamente.'));
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCartao(numeroCartao: string) {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
      try {
        await firstValueFrom(this.cartaoService.delete(numeroCartao));
        this.showSuccess('Cartão excluído com sucesso');
        this.loadCartoes();
      } catch (error) {
        this.showError('Erro ao excluir cartão');
      }
    }
  }

  private showSuccess(message: string) {
    this.toast.show(message, 'Sucesso');
  }

  private showError(message: string) {
    this.toast.show(message, 'Erro!');
  }
}