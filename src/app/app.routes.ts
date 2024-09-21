import { Routes } from '@angular/router';
import { PruebasCompComponent } from './common/pruebas-comp/pruebas-comp.component';

export const routes: Routes = [
  { path: 'PruebasComponents', component: PruebasCompComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: 'admin' },
];
