import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-bar',
  templateUrl: './icon-bar.component.html',
  styleUrls: ['./icon-bar.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class IconBarComponent {
  toggleModule(module: string) {
    // Lógica para habilitar/desabilitar módulos
  }
}
