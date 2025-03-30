import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PlanoService } from '../../../service/cadastro/plano/Plano.service';
import { TableColumn } from '../../../components/data-table/data-table.component';
import { PlanoFormDialogComponent } from '../../../components/plano-form-dialog/plano-form-dialog.component';
import { PageContainerComponent } from '../../../components/page-container/page-container.component';
import { SearchToolbarComponent } from '../../../components/search-toolbar/search-toolbar.component';
import { DataTableComponent } from '../../../components/data-table/data-table.component';


@Component({
  selector: 'app-plano-list',
  standalone: true,
  imports: [CommonModule, PageContainerComponent, SearchToolbarComponent, DataTableComponent],
  templateUrl: './plano-list.component.html'
})
export class PlanoListComponent {
  private planoService = inject(PlanoService);
  private dialog = inject(MatDialog);

  planos = signal<any[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  columns: TableColumn[] = [
    { key: 'id', header: 'ID', type: 'text' },
    { key: 'nome', header: 'Nome', type: 'text' },
    { key: 'precoBasePorLoja', header: 'Preço Base', type: 'currency' },
    { key: 'gratuito', header: 'Gratuito', type: 'boolean' }
  ];

  filteredPlanos = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.planos().filter(plano =>
      plano.nome.toLowerCase().includes(term) ||
      plano.precoBasePorLoja.toString().includes(term)
    );
  });

  constructor() {
    this.loadPlanos();
  }

  async loadPlanos() {
    this.loading.set(true);
    try {
      this.planoService.getAll().subscribe(planos => {
        this.planos.set(planos);
      });
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  handleSearch(term: string) {
    this.searchTerm.set(term);
  }

  openFormDialog(plano?: any) {
    const dialogRef = this.dialog.open(PlanoFormDialogComponent, {
      width: '600px',
      data: plano ? { ...plano } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPlanos();
    });
  }

  async deletePlano(plano: any) {
    if (confirm(`Tem certeza que deseja excluir o plano ${plano.nome}?`)) {
      await this.planoService.delete(plano.id);
      this.loadPlanos();
    }
  }
}
