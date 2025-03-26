import { Component, Inject, inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanoService } from '../../service/cadastro/plano/Plano.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-plano-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './plano-form-dialog.component.html',
  styleUrls: ['./plano-form-dialog.component.scss']
})
export class PlanoFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly planoService = inject(PlanoService);
  private readonly dialogRef = inject(MatDialogRef<PlanoFormDialogComponent>);

  form = this.fb.group({
    nome: ['', Validators.required],
    precoBasePorLoja: [0, [Validators.required, Validators.min(0)]],
    gratuito: [false],
    tempoDuracaoEmMeses: [null as number | null],
    modulos: [[] as number[]]
  });

  modulosDisponiveis: any[] = [];
  saving = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { plano?: any, mode: 'create' | 'edit' }) {
    if (data.plano) {
      this.form.patchValue(data.plano);
    }

    this.carregarModulos();
  }

  async carregarModulos() {
    // Implemente a chamada para carregar os módulos disponíveis
    this.modulosDisponiveis = await this.planoService.getModulosDisponiveis();
  }

  async save() {
    if (this.form.invalid) return;

    this.saving = true;
    try {
      const formValue = this.form.value;

      this.dialogRef.close(true); // Fecha o dialog e indica sucesso
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
    } finally {
      this.saving = false;
    }
  }
}

@NgModule({
  declarations: [
    // other components
  ],
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    // other modules
  ],
  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule { }
