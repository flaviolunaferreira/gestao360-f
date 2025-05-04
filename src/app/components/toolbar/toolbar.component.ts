import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: []
})
export class ToolbarComponent {

  constructor(private router: Router) {}

  toggleSidebar() {
    // Lógica para alternar a visibilidade da sidebar
  }

  login() {
    this.router.navigate(['login']); // Navega para a rota raiz 
  }

}
