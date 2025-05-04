import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() title: string = 'Notificação';
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  visible = false;

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}