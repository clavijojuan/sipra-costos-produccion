import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent {
  @Output() buscar = new EventEmitter();

  public valor = null;

  enviar() {
    console.log("enviar", this.valor);
    this.buscar.emit(this.valor);
  }
}
