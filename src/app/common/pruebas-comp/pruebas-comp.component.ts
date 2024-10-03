import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CustomDecimalFormatPipe } from '../pipes/custom-decimal-format.pipe';
import { TablasComponent } from '../tablas/tablas.component';
import { SearchPipeGeneral } from '../pipes/search-pipe-general.pipe';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const titulos = [
  {
    clave: 'position',
    alias: 'id',
    alinear: 'centrado',
  },
  {
    clave: 'name',
    alias: 'Nombre',
    alinear: 'izquierda',
  },
  {
    clave: 'weight',
    alias: 'Peso',
    alinear: 'izquierda',
    tipo: 'money',
  },
] as any[];

@Component({
  selector: 'app-pruebas-comp',
  standalone: true,
  imports: [SearchPipeGeneral, TablasComponent, CustomDecimalFormatPipe],
  templateUrl: './pruebas-comp.component.html',
  styleUrl: './pruebas-comp.component.scss',
})
export class PruebasCompComponent {
  displayedColumns: string[] = titulos;
  dataSource = ELEMENT_DATA;
  data = 1235645.256;
}
