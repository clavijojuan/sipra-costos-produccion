import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipeGeneral } from '../pipes/search-pipe-general.pipe';
import { CustomDecimalFormatPipe } from '../pipes/custom-decimal-format.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tablas',
  standalone: true,
  imports: [CommonModule, SearchPipeGeneral, CustomDecimalFormatPipe],
  templateUrl: './tablas.component.html',
  styleUrl: './tablas.component.scss',
})
export class TablasComponent implements OnChanges {
  @Input() titulos: any[] = [];
  @Input() datos: any[] = [];
  @Input() raiz: any = '';
  @Input() accionVer: any = false;
  @Input() accionEditar: any = false;
  @Input() accionEliminar: any = false;
  @Input() mostrarBuscar: any = false;
  @Output() consultar = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  public path = '';
  public buscarTexto = '';
  public accionVerActivo = false;
  public accionEditarActivo = false;
  public accionEliminarActivo = false;
  public buscador = true;

  public tabla: any = {
    titulos: [],
    datos: [],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['raiz']) {
      this.path = changes['raiz']['currentValue'];
    }
    if (changes['titulos']) {
      this.tabla.titulos = changes['titulos']['currentValue'];
    }
    if (changes['datos']) {
      this.tabla.datos = changes['datos']['currentValue'];
    }
    if (changes['accionVer']) {
      this.accionVerActivo = changes['accionVer']['currentValue'];
    }
    if (changes['accionEditar']) {
      this.accionEditarActivo = changes['accionEditar']['currentValue'];
    }
    if (changes['accionEliminar']) {
      this.accionEliminarActivo = changes['accionEliminar']['currentValue'];
    }
    if (changes['mostrarBuscar']) {
      this.buscador = changes['mostrarBuscar']['currentValue'];
    }
  }

  consultarRegistro(id: string) {
    this.consultar.emit(id);
  }

  editarRegistro(id: string) {
    this.editar.emit(id);
  }

  eliminarRegistro(valor: any) {
    Swal.fire({
      title: '¿Está seguro de borrar el registro ' + valor + '?',
      text: 'Esta acción no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar.emit(valor);
      }
    });
  }

  // buscar(event:any) {
  //   this.buscarTexto = event;
  // }
}
