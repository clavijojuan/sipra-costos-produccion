import { Routes } from '@angular/router';
import { CostosComponent } from './pages/costos/costos.component';
import { CostosFormComponent } from './components/costos-form/costos-form.component';
import { authGuard } from '../auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'productor-list', component: CostosComponent },
  {
    path: 'productor',
    component: CostosFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'productor/:id',
    component: CostosFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'productor/:id/edit',
    component: CostosFormComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'productor-list' },
];
