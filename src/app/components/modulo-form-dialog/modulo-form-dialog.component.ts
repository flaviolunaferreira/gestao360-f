import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModuloService } from '../../service/cadastro/modulo/Modulo.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-modulo-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './modulo-form-dialog.component.html',
  styleUrls: ['./modulo-form-dialog.component.scss']
})
export class ModuloFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ModuloFormDialogComponent>);
  private readonly moduloService = inject(ModuloService);

  form: FormGroup;
  loading = false;
  mode: 'create' | 'edit' = 'create'; // Valor padrão
  isEditMode: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
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

      this.dialogRef.close(true);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
