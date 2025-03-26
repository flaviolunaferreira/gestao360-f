import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloService } from '../../../service/cadastro/modulo/Modulo.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modulo-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './modulo-list.component.html',
  styleUrls: ['./modulo-list.component.scss']
})
export class ModuloListComponent {
  isEditMode: boolean = false;
  private moduloService = inject(ModuloService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Estado da aplicação
  modulos = signal<any[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  editMode = signal(false);
  currentId = signal<number | null>(null);

  // Formulário reativo
  moduloForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    percentualCusto: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  // Colunas da tabela
  displayedColumns: string[] = ['nome', 'percentualCusto', 'actions'];

  // Filtro computado
  filteredModulos = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.modulos().filter(modulo =>
      modulo.nome.toLowerCase().includes(term)
    );
  });

  constructor() {
    this.loadModulos();
  }

  async loadModulos() {
    this.loading.set(true);
    try {
      const modulos = await firstValueFrom(this.moduloService.getAll());
      this.modulos.set(modulos || []);
    } catch (error) {
      this.showError('Erro ao carregar módulos');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(modulo: any) {
    this.currentId.set(modulo.id);
    this.editMode.set(true);
    this.moduloForm.patchValue(modulo);
  }

  cancelEdit() {
    this.editMode.set(false);
    this.currentId.set(null);
    this.moduloForm.reset();
  }

  async saveModulo() {
    if (this.moduloForm.invalid) return;

    this.loading.set(true);
    try {
      const formData = this.moduloForm.value;

      if (this.editMode()) {
        await firstValueFrom(this.moduloService.update(this.currentId()!, {
          ...formData,
          nome: formData.nome || '',
          percentualCusto: formData.percentualCusto ?? 0 // Garantir que percentualCusto não seja null
        }));
        this.showSuccess('Módulo atualizado com sucesso');
      } else {
        await firstValueFrom(this.moduloService.create({
          nome: formData.nome || '',
          percentualCusto: formData.percentualCusto ?? 0 // Garantir que percentualCusto não seja null
        }));
        this.showSuccess('Módulo criado com sucesso');
      }

      this.cancelEdit();
      this.loadModulos();
    } catch (error) {
      this.showError('Erro ao salvar módulo');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteModulo(id: number) {
    if (confirm('Tem certeza que deseja excluir este módulo?')) {
      try {
        await firstValueFrom(this.moduloService.delete(id));
        this.showSuccess('Módulo excluído com sucesso');
        this.loadModulos();
      } catch (error) {
        this.showError('Erro ao excluir módulo');
      }
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
