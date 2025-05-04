import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloService } from '../../../service/cadastro/modulo/Modulo.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-modulo-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './modulo-list.component.html',
  styleUrls: ['./modulo-list.component.scss']
})
export class ModuloListComponent {
  isEditMode: boolean = false;
  private moduloService = inject(ModuloService);
  private fb = inject(FormBuilder);

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

  constructor(private toast: ToastService) {
    this.loadModulos();
  }

  async loadModulos() {
    this.loading.set(true);
    try {
      const modulos = await firstValueFrom(this.moduloService.getAll());
      this.modulos.set(modulos || []);
    } catch (error) {
      this.toast.show('Erro ao carregar módulos', 'Erro!');
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
        this.toast.show('Módulo atualizado com sucesso', 'Sucesso!');
      } else {
        await firstValueFrom(this.moduloService.create({
          nome: formData.nome || '',
          percentualCusto: formData.percentualCusto ?? 0 // Garantir que percentualCusto não seja null
        }));
        this.toast.show('Módulo criado com sucesso', 'Sucesso!');
      }

      this.cancelEdit();
      this.loadModulos();
    } catch (error) {
      this.toast.show('Erro ao salvar módulo', 'Erro!');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteModulo(id: number) {
    if (confirm('Tem certeza que deseja excluir este módulo?')) {
      try {
        await firstValueFrom(this.moduloService.delete(id));
        this.toast.show('Módulo excluído com sucesso', 'Sucesso!');
        this.loadModulos();
      } catch (error) {
        this.toast.show('Erro ao excluir módulo', 'Erro!');
      }
    }
  }

  private showSuccess(message: string) {
    this.toast.show(message, 'Sucesso')
  }

  private showError(message: string) {
    this.toast.show(message, 'Erro!');
  }
}
