import { Component, inject } from '@angular/core';
import { CategoriasService } from '../../services/categorias.service';
import { TablasComponent } from '../../../common/tablas/tablas.component';
import { Router } from '@angular/router';
import { Categorias } from '../../interfaces/categoria';
import { PrimengModule } from '../../../primeng/primeng.module';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [TablasComponent, PrimengModule],
  templateUrl: './categorias-list.component.html',
  styleUrl: './categorias-list.component.scss',
})
export class CategoriasListComponent {
  private categoriasSrv = inject(CategoriasService);
  categorias: Categorias = {};

  titulos: any[] = [
    {
      clave: 'id',
      alias: 'Código',
      alinear: 'centrado',
    },
    {
      clave: 'labelCategorias',
      alias: 'Categoria',
      alinear: 'centrado',
    },
  ];
  datos: any = [];

  constructor(private router: Router) {
    this.categoriasSrv.getCategorias().subscribe({
      next: (categorias) => {
        this.datos = categorias;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  crear() {
    this.router.navigate([`admin/categoria`]);
  }

  editar(id: string): void {
    this.router.navigate([`admin/categoria/${id}/edit`]);
  }

  consultar(id: string) {
    this.router.navigate([`admin/categoria/${id}`]);
  }

  eliminar(index: number) {
    this.categoriasSrv.deleteCategoria(index);
  }
}
