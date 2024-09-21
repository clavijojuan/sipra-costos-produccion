import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, tap } from 'rxjs';

import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class CultivosService {
  constructor(private http: HttpClient) {}

  private cultivos: any = [];

  getCultivos() {
    if (this.cultivos.length) return of(this.cultivos);

    const filePath = 'assets/cultivos.xlsx';
    return this.http.get(filePath, { responseType: 'arraybuffer' }).pipe(
      map((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { header: 0 });
      }),
      tap((response) => {
        this.cultivos = response;
      })
    );
  }
}
