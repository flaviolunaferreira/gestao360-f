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

  // Lista de opções para cada ícone, com ícones do Bootstrap Icons
  private optionsForIcons: SidebarOption[][] = [
    // Opções para o ícone 0 (Home)
    [
      { icon: 'house', text: 'Página Inicial', route: '/home' },
      { icon: 'speedometer2', text: 'Dashboard', route: '/dashboard' }
    ],
    // Opções para o ícone 1 (Cadastro)
    [
      { icon: 'bank', text: 'Banco', route: '/banco' },
      { icon: 'cash-coin', text: 'Conta Corrente', route: '/conta-corrente' },
      { icon: 'credit-card', text: 'Cartão', route: '/cartao' },
      { icon: 'people', text: 'Clientes', route: '/clientes' },
      { icon: 'wallet2', text: 'Conta', route: '/conta' },
      { icon: 'building', text: 'Empresa Cliente', route: '/empresa-cliente' },
      { icon: 'truck', text: 'Fornecedor', route: '/cadastro/fornecedor' },
      { icon: 'person-badge', text: 'Funcionários', route: '/cadastro/funcionarios' },
      { icon: 'shop', text: 'Loja', route: '/cadastro/loja' },
      { icon: 'grid', text: 'Módulo', route: '/cadastro/modulo' },
      { icon: 'file-text', text: 'Plano Contratado', route: '/cadastro/plano-contratado' },
      { icon: 'box', text: 'Produto', route: '/cadastro/produto' },
      { icon: 'person', text: 'Usuário', route: '/cadastro/usuario' }
    ],
    // Opções para o ícone 2 (Admin)
    [
      { icon: 'shield-lock', text: 'Permissões', route: '/admin/permissoes' },
      { icon: 'people', text: 'Usuários', route: '/admin/usuarios' }
    ],
    // Opções para o ícone 3 (Config)
    [
      { icon: 'gear', text: 'Configurações', route: '/configuracoes' },
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