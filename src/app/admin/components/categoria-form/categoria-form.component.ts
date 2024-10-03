import { Component, OnInit, inject, signal } from '@angular/core';
import { PrimengModule } from '../../../primeng/primeng.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriasService } from '../../services/categorias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../interfaces/categoria';
import { TablasComponent } from '../../../common/tablas/tablas.component';
import { hexToRgb, rgbToHex } from '../../../common/helpers/color';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

type Mode = 'query' | 'new' | 'edit';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimengModule, TablasComponent],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss',
})
export class CategoriaFormComponent implements OnInit {
  private categoriasSrv = inject(CategoriasService);

  categoria: any;

  titulos: any = [
    {
      clave: 'id',
      alias: 'Código',
      alinear: 'centrado',
    },
    {
      clave: 'order',
      alias: 'Orden',
      alinear: 'centrado',
    },
    {
      clave: 'nombre',
      alias: 'Nombre',
      alinear: 'centrado',
    },
    {
      clave: 'valor',
      alias: 'Valor',
      alinear: 'centrado',
    },
    {
      clave: 'color',
      alias: 'Color',
      alinear: 'centrado',
      tipo: 'color',
    },
  ];
  datos: any = [];

  form: FormGroup = this.fb.group({
    id: [{ value: undefined, disabled: true }],
    labelCategorias: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    categorias: this.fb.array([]),
  });

  mode = signal<Mode>('new');

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    const { params } = this.activatedRoute.snapshot;
    const { id } = params;

    if (id) {
      this.mode.set('query');

      this.categoriasSrv.getCategoriaById(id).subscribe({
        next: (categoria) => {
          this.setFormValues(categoria);
        },
        error: (error) => {
          console.log(error);
        },
      });
      if (this.activatedRoute.routeConfig?.path?.includes('edit')) {
        this.mode.set('edit');
        this.enableFormFields();
      }
    } else {
      this.enableFormFields();
    }
  }

  ngOnInit(): void {}

  get categoriasFormArray() {
    return this.form.get('categorias')! as any;
  }

  setFormValues(categoria: Categoria) {
    this.categoria = categoria;
    this.form.patchValue(categoria);
    this.computeSubCategorias();
  }

  computeSubCategorias() {
    this.datos = this.categoria.categorias.map(
      (categoria: any, index: number) => {
        const obj = {
          ...categoria,
          id: index,
          color: rgbToHex(categoria.color),
        };

        const group = this.addSubCategory();

        group.patchValue(obj);
        return obj;
      }
    );
  }

  enableFormFields() {
    const fields = ['labelCategorias'];
    fields.forEach((field) => {
      this.form.get(field)!.enable();
    });
  }

  back() {
    this.router.navigate(['admin']);
  }

  reset() {
    this.categoriasFormArray.clear();
    this.form.reset();
  }

  create() {
    const data = this.form.getRawValue();
    data.categorias.forEach((categoria: any) => {
      categoria['color'] = hexToRgb(categoria['color']);
    });

    this.categoriasSrv.createCategoria(data);
    this.router.navigate(['admin/categorias-list']);
  }

  update() {
    const { id, ...rest } = this.form.getRawValue();
    rest.categorias.forEach((categoria: any) => {
      categoria['color'] = hexToRgb(categoria['color']);
    });

    this.categoriasSrv.updateCategoria(id, rest);
    this.router.navigate(['admin/categorias-list']);
  }

  deleteSubcategory(index: number) {
    Swal.fire({
      title: '¿Está seguro de borrar el registro ?',
      text: 'Esta acción no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriasFormArray.removeAt(index);
      }
    });
  }

  addSubCategory() {
    const categoriasArray = this.categoriasFormArray;
    const index = categoriasArray.controls.length;
    const group = this.fb.group({
      id: [{ value: index, disabled: false }, [Validators.required]],
      order: [{ value: undefined, disabled: false }, [Validators.required]],
      nombre: [{ value: undefined, disabled: false }, [Validators.required]],
      valor: [{ value: undefined, disabled: false }, [Validators.required]],
      color: [{ value: '#cecece', disabled: false }, [Validators.required]],
    });
    categoriasArray.push(group);

    return group;
  }
}
