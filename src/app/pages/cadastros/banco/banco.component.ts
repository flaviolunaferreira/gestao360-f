import { Component, ElementRef, OnInit, inject, signal } from '@angular/core';
import { BancoService } from '../../../service/cadastro/Banco.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Banco, CreateBancoDTO, UpdateBancoDTO } from '../../../interface/cadastro/Banco';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../service/toast/toast.service';
import * as bootstrap from 'bootstrap';
import { elementAt, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss']
})
export class BancoComponent implements OnInit {

  private bancoService = inject(BancoService);
  private fb = inject(FormBuilder);

  bancos = signal<Banco[]>([]);
  filteredBancos = signal<Banco[]>([]);
  paginatedBancos = signal<Banco[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  isEditing = signal(false);
  currentEditId = signal<string | null>(null);
  selectedBanco = signal<Banco | null>(null);
  sortField = signal<string>('id');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);
  totalPages = signal<number>(1);

  bancoForm = this.fb.group({
    id: ['', [Validators.required, Validators.maxLength(10)]],
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    codigoISPB: ['', [Validators.required, Validators.maxLength(8)]]
  });

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.loadBancos();
  }

  async loadBancos() {
    this.loading.set(true);
    try {
      this.bancoService.getAll().subscribe(bancos => {
        this.bancos.set(bancos);
        this.filteredBancos.set(bancos);
        this.updatePagination();
      });
    } catch (error) {
      this.showError('Erro ao carregar bancos');
    } finally {
      this.loading.set(false);
    }
  }

  filterBancos() {
    const term = this.searchTerm().toLowerCase();
    this.bancoService.getAll().subscribe((bancos: any[]) => {
      const filtered = bancos.filter(banco =>
        banco.id.toLowerCase().includes(term) ||
        banco.nome.toLowerCase().includes(term) ||
        banco.codigoISPB.toLowerCase().includes(term)
      );
      this.filteredBancos.set(filtered);
      this.currentPage.set(1); // Resetar para a primeira página
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

    const sortedBancos = [...this.filteredBancos()].sort((a, b) => {
      const valueA = a[field as keyof Banco];
      const valueB = b[field as keyof Banco];
      const direction = this.sortDirection() === 'asc' ? 1 : -1;

      if ((valueA ?? '') < (valueB ?? '')) return -1 * direction;
      if ((valueA ?? '') > (valueB ?? '')) return 1 * direction;
      return 0;
    });

    this.filteredBancos.set(sortedBancos);
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    const paginated = this.filteredBancos().slice(start, end);
    this.paginatedBancos.set(paginated);
    this.totalPages.set(Math.ceil(this.filteredBancos().length / this.itemsPerPage()));
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
    this.currentPage.set(1); // Resetar para a primeira página
    this.updatePagination();
  }

  startEdit(banco: Banco) {
    this.currentEditId.set(banco.id);
    this.isEditing.set(true);
    this.bancoForm.patchValue({
      id: banco.id,
      nome: banco.nome,
      codigoISPB: banco.codigoISPB
    });
  }

  showDetails(banco: Banco) {
    this.selectedBanco.set(banco);
    const modal = new bootstrap.Modal(document.getElementById('detailsModal')!);
    modal.show();
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
        await firstValueFrom(this.bancoService.update(this.currentEditId()!, formData as UpdateBancoDTO));
        this.showSuccess('Banco atualizado com sucesso');
      } else {
        await firstValueFrom(this.bancoService.create(formData as CreateBancoDTO));
        this.showSuccess('Banco criado com sucesso');
      }

      this.cancelEdit();
      await this.loadBancos();
      const elemento = document.getElementById("idBanco");
      if (elemento) {
        elemento.focus();
      }
    } catch (error) {
      this.showError('Erro ao salvar banco: ' + (error instanceof Error ? error.message : 'Tente novamente.'));
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
    this.toast.show(message, 'Sucesso');
  }

  private showError(message: string) {
    this.toast.show(message, 'Erro!');
  }
}