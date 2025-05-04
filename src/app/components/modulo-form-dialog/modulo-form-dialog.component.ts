import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ModuloService } from '../../service/cadastro/modulo/Modulo.service';

@Component({
  selector: 'app-modulo-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './modulo-form-dialog.component.html',
  styleUrls: ['./modulo-form-dialog.component.scss']
})
export class ModuloFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly moduloService = inject(ModuloService);

  form: FormGroup;
  loading = false;
  mode: 'create' | 'edit' = 'create'; // Valor padrão
  isEditMode: boolean = false;

  constructor(@Inject('MODAL_DATA') public data: {
    modulo?: any,
    mode?: 'create' | 'edit' // Tornando opcional
  }) {
    // Define o mode com fallback para 'create' se não fornecido
    this.mode = data?.mode || 'create';

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      percentualCusto: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)]
      ]
    });

    if (this.mode === 'edit' && data?.modulo) {
      this.form.patchValue(data.modulo);
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Novo Módulo' : 'Editar Módulo';
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    try {
      const formData = this.form.value;

      if (this.mode === 'edit') {
        await this.moduloService.update(this.data.modulo.id, formData).toPromise();
      } else {
        await this.moduloService.create(formData).toPromise();
      }

      // Fechar modal (ajuste necessário para o Bootstrap)
      this.closeModal(true);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    // Fechar modal (ajuste necessário para o Bootstrap)
    this.closeModal(false);
  }

  private closeModal(result: boolean): void {
    // Implementação para fechar o modal com Bootstrap
    const modalElement = document.querySelector('.modal');
    if (modalElement) {
      (modalElement as any).dispatchEvent(new CustomEvent('close', { detail: result }));
    }
  }
}
