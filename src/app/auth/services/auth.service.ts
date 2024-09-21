import { Injectable } from '@angular/core';
import { ArcgisService } from '../../common/services/arcgis.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private arcgisSrv: ArcgisService) {}

  openedSession(): Observable<boolean> {
    if (this.arcgisSrv.arcgisToken) return of(true);
    if (!localStorage.getItem('token')) return of(false);
    else {
      this.arcgisSrv.arcgisToken = localStorage.getItem('token')!;
      return of(true);
    }
  }
}
