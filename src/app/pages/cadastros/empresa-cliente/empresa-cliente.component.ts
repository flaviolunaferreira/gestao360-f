import { Component, OnInit } from '@angular/core';
import { DynamicCrudComponent } from '../../../components/dynamic-crud/dynamic-crud.component';
import { EmpresaServiceService } from '../../../service/cadastro/empresa/EmpresaService.service';
import { CommonModule } from '@angular/common';
import { FieldConfig } from '../../../interface/Field-config.model';
import { ToastService } from '../../../service/toast/toast.service';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  planoId: number;
}

@Component({
  selector: 'app-empresa-cliente',
  standalone: true,
  imports: [CommonModule, DynamicCrudComponent],
  template: `
    @if (loading) {
      <div class="loading-spinner">Carregando configuração...</div>
    } @else if (error) {
      <div class="error-message">{{ error }}</div>
    } @else {
      <app-dynamic-crud 
        [config]="config"
        [initialData]="empresas"
        (onCreate)="createEmpresa($event)"
        (onUpdate)="updateEmpresa($event)"
        (onRemove)="deleteEmpresa($event)"
        (onLoadData)="loadEmpresas()"
      ></app-dynamic-crud>
    }
  `,
  styles: [`
    .loading-spinner {
      padding: 2rem;
      text-align: center;
      color: #666;
    }
    
    .error-message {
      color: #d32f2f;
      padding: 1rem;
      background-color: #fde0e0;
      border-radius: 4px;
      margin: 1rem 0;
    }
  `]
})
export class EmpresaClienteComponent implements OnInit {
  config: any = null;
  empresas: Empresa[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private empresaService: EmpresaServiceService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadConfig();
    this.loadEmpresas();
  }

  loadConfig(): void {
    this.empresaService.getConfig().subscribe({
      next: (fields: FieldConfig[]) => {
        this.config = {
          title: 'Cadastro de Empresas',
          fields: fields,
          actions: {
            view: true,
            edit: true,
            delete: true
          }
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar configuração.';
        this.loading = false;
        this.toast.show('Erro ao carregar configuração do formulário', 'Erro!');
      }
    });
  }

  loadEmpresas(): void {
    this.empresaService.getAll().subscribe({
      next: (data: Empresa[]) => {
        this.empresas = data;
      },
      error: (err) => {
        this.toast.show('Erro ao carregar lista de empresas', 'Erro!');
      }
    });
  }

  createEmpresa(data: Omit<Empresa, 'id'>): void {
    this.empresaService.create(data).subscribe({
      next: () => {
        this.toast.show('Empresa criada com sucesso!', 'Sucesso!');
        this.loadEmpresas();
      },
      error: (err) => {
        this.toast.show('Erro ao criar empresa', 'Erro!');
      }
    });
  }

  updateEmpresa({id, data}: {id: number, data: Partial<Empresa>}): void {
    this.empresaService.update(id, data).subscribe({
      next: () => {
        this.toast.show('Empresa atualizada com sucesso!', 'Sucesso!');
        this.loadEmpresas();
      },
      error: (err) => {
        this.toast.show('Erro ao atualizar empresa', 'Erro!');
      }
    });
  }

  deleteEmpresa(id: number): void {
    this.empresaService.delete(id).subscribe({
      next: () => {
        this.toast.show('Empresa excluída com sucesso!', 'Sucesso!');
        this.loadEmpresas();
      },
      error: (err) => {
        this.toast.show('Erro ao excluir empresa', 'Erro!');
      }
    });
  }
}