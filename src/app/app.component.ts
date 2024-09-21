import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PruebasCompComponent } from './common/pruebas-comp/pruebas-comp.component';
import { CustomDecimalFormatPipe } from './common/pipes/custom-decimal-format.pipe';
import { LoadingService } from './common/services/loading.service';
import { delay } from 'rxjs';
import { LoadingComponent } from './common/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PruebasCompComponent,
    CustomDecimalFormatPipe,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'costos de produccion';
  loading: boolean = false;

  constructor(private loadingSrv: LoadingService) {
    this.loadingSrv.loading.pipe(delay(0)).subscribe((loading) => {
      this.loading = loading;
    });
  }
}
