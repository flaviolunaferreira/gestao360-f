import { Component, EventEmitter, Output } from '@angular/core';
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
  imports: []
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
      { icon: 'account_balance', text: 'Banco', route: '/cadastro/banco' },
      { icon: 'credit_card', text: 'Cartão', route: '/cadastro/cartao' },
      { icon: 'people', text: 'Clientes', route: '/cadastro/clientes' },
      { icon: 'account_balance_wallet', text: 'Conta', route: '/cadastro/conta' },
      { icon: 'business', text: 'Empresa Cliente', route: '/empresa-cliente' },
      { icon: 'local_shipping', text: 'Fornecedor', route: '/cadastro/fornecedor' },
      { icon: 'badge', text: 'Funcionários', route: '/cadastro/funcionarios' },
      { icon: 'store', text: 'Loja', route: '/cadastro/loja' },
      { icon: 'apps', text: 'Módulo', route: '/cadastro/modulo' },
      { icon: 'assignment', text: 'Plano Contratado', route: '/cadastro/plano-contratado' },
      { icon: 'inventory', text: 'Produto', route: '/cadastro/produto' },
      { icon: 'person', text: 'Usuário', route: '/cadastro/usuario' }
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