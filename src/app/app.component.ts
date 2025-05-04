import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { IconBarComponent } from './components/icon-bar/icon-bar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FooterComponent,
    SidebarComponent,
    ToolbarComponent,
    IconBarComponent,
    HttpClientModule
  ]
})
export class AppComponent {
  isSidebarOpen = false; // Controla a visibilidade da sidebar
  sidebarOptions: string[] = []; // Opções passadas para a sidebar

  toggleSidebar(options: string[]) {
    if (this.isSidebarOpen && this.sidebarOptions === options) {
      this.isSidebarOpen = false; // Fecha a sidebar se as mesmas opções forem clicadas
    } else {
      this.isSidebarOpen = true; // Abre a sidebar
      this.sidebarOptions = options; // Atualiza as opções
    }
  }
}