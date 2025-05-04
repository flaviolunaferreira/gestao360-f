import { ApplicationRef, ComponentRef, Injectable, createComponent } from '@angular/core';
import { ToastComponent } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastRef: ComponentRef<ToastComponent> | null = null;

  constructor(private appRef: ApplicationRef) {}

  show(message: string, title: string = 'Notificação', type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    if (!this.toastRef) {
      this.toastRef = createComponent(ToastComponent, {
        environmentInjector: this.appRef.injector
      });
      document.body.appendChild(this.toastRef.location.nativeElement);
      this.appRef.attachView(this.toastRef.hostView);
    }

    this.toastRef.setInput('title', title);
    this.toastRef.setInput('message', message);
    this.toastRef.setInput('type', type);
    this.toastRef.instance.show();

    // Auto-esconder após 5 segundos
    setTimeout(() => this.hide(), 5000);
  }

  hide() {
    if (this.toastRef) {
      this.toastRef.instance.hide();
      this.appRef.detachView(this.toastRef.hostView);
      this.toastRef.destroy();
      this.toastRef = null;
    }
  }
}