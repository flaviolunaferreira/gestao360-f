import { Routes } from '@angular/router';
import { ModuloListComponent } from './pages/cadastros/modulo-list/modulo-list.component';

export const routes: Routes = [
  { path: '', component: ModuloListComponent },
  { path: 'modulo', component: ModuloListComponent },
];
