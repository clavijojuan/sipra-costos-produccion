import { Routes } from '@angular/router';
import { CategoriasListComponent } from './pages/categorias-list/categorias-list.component';
import { CategoriaFormComponent } from './components/categoria-form/categoria-form.component';

export const routes: Routes = [
  { path: 'categorias-list', component: CategoriasListComponent },
  { path: 'categoria', component: CategoriaFormComponent },
  { path: 'categoria/:id', component: CategoriaFormComponent },
  { path: 'categoria/:id/edit', component: CategoriaFormComponent },
  { path: '**', redirectTo: 'categorias-list' },
];
