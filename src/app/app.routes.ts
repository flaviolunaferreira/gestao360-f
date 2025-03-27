import { Routes } from '@angular/router';
import { ModuloListComponent } from './pages/cadastros/modulo-list/modulo-list.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '',
    loadComponent: () => import('./app.component').then(m => m.AppComponent),
    canActivate: [authGuard]
  },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: '/app.component', pathMatch: 'full' },
  { path: 'modulo', component: ModuloListComponent },
];
