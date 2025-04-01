import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface SidebarOption {
  icon: string;
  text: string;
  route: string;
}

@Component({
  selector: 'app-icon-bar',
  templateUrl: './icon-bar.component.html',
  styleUrls: ['./icon-bar.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class IconBarComponent {
  constructor(private router: Router) {}

  selectedImage: number | null = null;
  
  // Emite as opções para o sidebar quando um ícone é clicado
  @Output() sendOptionsToSidebar = new EventEmitter<SidebarOption[]>();

  // Lista de opções para cada ícone
  private optionsForIcons: SidebarOption[][] = [
    // Opções para o ícone 0 (Home)
    [
      { icon: 'home', text: 'Página Inicial', route: '/home' },
      { icon: 'dashboard', text: 'Dashboard', route: '/dashboard' }
    ],
    // Opções para o ícone 1 (Cadastro)
    [
      { icon: 'person_add', text: 'Novo Cadastro', route: '/cadastro/novo' },
      { icon: 'list', text: 'Lista de Cadastros', route: '/cadastro/lista' }
    ],
    // Opções para o ícone 2 (Admin)
    [
      { icon: 'admin_panel_settings', text: 'Permissões', route: '/admin/permissoes' },
      { icon: 'people', text: 'Usuários', route: '/admin/usuarios' }
    ],
    // Opções para o ícone 3 (Config)
    [
      { icon: 'settings', text: 'Configurações', route: '/configuracoes' },
      { icon: 'palette', text: 'Temas', route: '/temas' }
    ]
  ];

  selectImage(index: number): void {
    if (this.selectedImage === index) {
      // Se clicar no mesmo ícone, deseleciona
      this.selectedImage = null;
      this.sendOptionsToSidebar.emit([]);
    } else {
      // Seleciona o novo ícone e envia as opções correspondentes
      this.selectedImage = index;
      this.sendOptionsToSidebar.emit(this.optionsForIcons[index]);
    }
  }

  hoverImage(index: number): void {
    // Lógica adicional se necessário
  }
  
  unhoverImage(index: number): void {
    // Lógica adicional se necessário
  }
}