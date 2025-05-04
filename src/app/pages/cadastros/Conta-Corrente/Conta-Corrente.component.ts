import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContaCorrenteService } from '../../../service/cadastro/conta-corrente/Conta-Corrente.service';
import { ContaCorrenteRequestDTO, ContaCorrenteResponseDTO } from '../../../interface/cadastro/Conta-Corrente';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../service/toast/toast.service';
import * as bootstrap from 'bootstrap';
import { firstValueFrom } from 'rxjs';
import { BancoService } from '../../../service/cadastro/Banco.service';

@Component({
  selector: 'app-conta-corrente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './conta-corrente.component.html',
  styleUrls: ['./conta-corrente.component.scss']
})
export class ContaCorrenteComponent implements OnInit {
  
  private contaCorrenteService = inject(ContaCorrenteService);
  private bancoService = inject(BancoService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  contas = signal<ContaCorrenteResponseDTO[]>([]);
  filteredContas = signal<ContaCorrenteResponseDTO[]>([]);
  paginatedContas = signal<ContaCorrenteResponseDTO[]>([]);
  bancos = signal<any[]>([]);
  tipoContas = ['CORRENTE', 'POUPANCA', 'SALARIO']; // Ajuste conforme enum TipoConta
  loading = signal(false);
  searchTerm = signal('');
  isEditing = signal(false);
  currentEditNumero = signal<string | null>(null);
  selectedConta = signal<ContaCorrenteResponseDTO | null>(null);
  sortField = signal<string>('numero');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);
  totalPages = signal<number>(1);

  contaForm = this.fb.group({
    numero: ['', [Validators.required, Validators.maxLength(20)]],
    dataAbertura: ['', Validators.required],
    bancoId: [null, Validators.required],
    tipoConta: ['', Validators.required],
    agencia: ['', [Validators.required, Validators.maxLength(10)]],
    titular: ['', [Validators.required, Validators.maxLength(100)]],
    cpfCnpjTitular: ['', [Validators.required, Validators.maxLength(14)]],
    saldo: [0, [Validators.required, Validators.min(0)]],
    limite: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.loadContas();
    this.loadBancos();
  }

  async loadContas() {
    this.loading.set(true);
    try {
      this.contaCorrenteService.getAll().subscribe(contas => {
        this.contas.set(contas);
        this.filteredContas.set(contas);
        this.updatePagination();
      });
    } catch (error) {
      this.showError('Erro ao carregar contas correntes');
    } finally {
      this.loading.set(false);
    }
  }

  async loadBancos() {
    try {
      this.bancoService.getAll().subscribe(bancos => {
        this.bancos.set(bancos);
      });
    } catch (error) {
      this.showError('Erro ao carregar bancos');
    }
  }

  filterContas() {
    const term = this.searchTerm().toLowerCase();
    this.contaCorrenteService.getAll().subscribe(contas => {
      const filtered = contas.filter(conta =>
        conta.numero.toLowerCase().includes(term) ||
        conta.bancoNome.toLowerCase().includes(term) ||
        conta.titular.toLowerCase().includes(term) ||
        conta.cpfCnpjTitular.toLowerCase().includes(term)
      );
      this.filteredContas.set(filtered);
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

    const sortedContas = [...this.filteredContas()].sort((a, b) => {
      const valueA = a[field as keyof ContaCorrenteResponseDTO];
      const valueB = b[field as keyof ContaCorrenteResponseDTO];
      const direction = this.sortDirection() === 'asc' ? 1 : -1;

      if ((valueA ?? '') < (valueB ?? '')) return -1 * direction;
      if ((valueA ?? '') > (valueB ?? '')) return 1 * direction;
      return 0;
    });

    this.filteredContas.set(sortedContas);
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    const paginated = this.filteredContas().slice(start, end);
    this.paginatedContas.set(paginated);
    this.totalPages.set(Math.ceil(this.filteredContas().length / this.itemsPerPage()));
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

  startEdit(conta: ContaCorrenteResponseDTO) {
    this.currentEditNumero.set(conta.numero);
    this.isEditing.set(true);
    this.contaForm.patchValue({
      numero: conta.numero,
      dataAbertura: conta.dataAbertura,
      bancoId: this.bancos().find(b => b.nome === conta.bancoNome)?.id,
      tipoConta: conta.tipoConta,
      agencia: conta.agencia,
      titular: conta.titular,
      cpfCnpjTitular: conta.cpfCnpjTitular,
      saldo: conta.saldo,
      limite: conta.limite
    });
  }

  showDetails(conta: ContaCorrenteResponseDTO) {
    this.selectedConta.set(conta);
    const modal = new bootstrap.Modal(document.getElementById('detailsModal')!);
    modal.show();
  }

  cancelEdit() {
    this.currentEditNumero.set(null);
    this.isEditing.set(false);
    this.contaForm.reset();
    const elemento = document.getElementById("idBanco");
    if (elemento) {
      elemento.focus();
    }
  }

  async onSubmit() {
    if (this.contaForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = {
        ...this.contaForm.value,
        bancoId: this.contaForm.value.bancoId ?? 0 // Ensure bancoId is a number
      } as ContaCorrenteRequestDTO;

      if (this.isEditing() && this.currentEditNumero()) {
        await firstValueFrom(this.contaCorrenteService.update(this.currentEditNumero()!, formData));
        this.showSuccess('Conta corrente atualizada com sucesso');
      } else {
        await firstValueFrom(this.contaCorrenteService.create(formData));
        this.showSuccess('Conta corrente criada com sucesso');
      }

      this.cancelEdit();
      await this.loadContas();
    } catch (error) {
      this.showError('Erro ao salvar conta corrente: ' + (error instanceof Error ? error.message : 'Tente novamente.'));
    } finally {
      this.loading.set(false);
    }
  }

  async deleteConta(numero: string) {
    if (confirm('Tem certeza que deseja excluir esta conta corrente?')) {
      try {
        await firstValueFrom(this.contaCorrenteService.delete(numero));
        this.showSuccess('Conta corrente excluída com sucesso');
        this.loadContas();
      } catch (error) {
        this.showError('Erro ao excluir conta corrente');
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