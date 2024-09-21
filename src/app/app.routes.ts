import { Routes } from '@angular/router';
import { PruebasCompComponent } from './common/pruebas-comp/pruebas-comp.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'PruebasComponents', component: PruebasCompComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'admin' },
];
