import { Routes } from '@angular/router';
import { ModuloListComponent } from './pages/cadastros/modulo/modulo-list.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'modulo', component: ModuloListComponent },
  { path: 'empresa-cliente', loadComponent: () => import('./pages/cadastros/empresa-cliente/empresa-cliente.component').then(m => m.EmpresaClienteComponent) },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];