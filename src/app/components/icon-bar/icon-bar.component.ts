import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-icon-bar',
  templateUrl: './icon-bar.component.html',
  styleUrls: ['./icon-bar.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class IconBarComponent {
  constructor(private router: Router) {}

  toggleModule(module: string) {
    // Lógica para habilitar/desabilitar módulos
  }

  btnClick() {
    this.router.navigate(['modulo']); // Navega para a rota raiz
  }
}
