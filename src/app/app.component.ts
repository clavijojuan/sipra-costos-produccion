import { Component, Pipe } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PruebasCompComponent } from './common/pruebas-comp/pruebas-comp.component';
import { CustomDecimalFormatPipe } from './common/pipes/custom-decimal-format.pipe';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PruebasCompComponent, CustomDecimalFormatPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'costos de produccion';
}
