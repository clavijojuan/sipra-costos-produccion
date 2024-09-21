import { Component } from '@angular/core';
import { CostosListComponent } from '../../components/costos-list/costos-list.component';
import { Router } from '@angular/router';
import { CostosService } from '../../services/costos.service';
import { ArcgisService } from '../../../common/services/arcgis.service';

@Component({
  selector: 'app-costos',
  standalone: true,
  imports: [CostosListComponent],
  templateUrl: './costos.component.html',
  styleUrl: './costos.component.scss',
})
export class CostosComponent {}
