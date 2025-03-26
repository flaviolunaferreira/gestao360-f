// src/app/shared/services/message.service.ts
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.show(message, 'success-snackbar');
  }

  error(message: string): void {
    this.show(message, 'error-snackbar');
  }

  private show(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: [panelClass],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
