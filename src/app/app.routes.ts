import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ModuloListComponent } from './pages/cadastros/modulo/modulo-list.component';
import { EmpresaClienteComponent } from './pages/cadastros/empresa-cliente/empresa-cliente.component';
import { BancoComponent } from './pages/cadastros/banco/banco.component';
import { CartaoComponent } from './pages/cadastros/cartao/cartao.component';
import { ClienteComponent } from './pages/cadastros/cliente/cliente.component';
import { FornecedorComponent } from './pages/cadastros/fornecedor/fornecedor.component';
import { FuncionarioComponent } from './pages/cadastros/funcionario/funcionario.component';
import { LojaComponent } from './pages/cadastros/loja/loja.component';
import { ProdutoComponent } from './pages/cadastros/produto/produto.component';
import { UsuarioComponent } from './pages/cadastros/usuario/usuario.component';
import { ContaComponent } from './pages/cadastros/conta/conta.component';
import { PlanoListComponent } from './pages/cadastros/plano/plano-list.component';

export const routes: Routes = [
  // Rotas de cadastro (todas públicas inicialmente)
  { path: 'banco', component: BancoComponent },
  { path: 'cartao', component: CartaoComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'conta', component: ContaComponent },
  { path: 'empresa-cliente', component: EmpresaClienteComponent },
  { path: 'fornecedor', component: FornecedorComponent },
  { path: 'funcionario', component: FuncionarioComponent },
  { path: 'loja', component: LojaComponent },
  { path: 'modulo', component: ModuloListComponent },
  { path: 'plano', component: PlanoListComponent },
  { path: 'produto', component: ProdutoComponent },
  { path: 'usuario', component: UsuarioComponent },
  
  // Rota de login (pública)
  { path: 'login', component: LoginComponent },
  

];