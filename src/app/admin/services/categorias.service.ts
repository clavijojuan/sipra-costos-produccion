import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { Categoria, Categorias } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private baseUrl: string = 'assets/config.json';
  categorias: any;

  constructor(private http: HttpClient) {}

  private structureCategorias() {
    return this.http.get(this.baseUrl).pipe(
      map((response: any) => {
        const categorias = response.categorias as any;
        return Object.entries(categorias).reduce(
          (prev: any, current: any, index: number) => {
            const [key, value] = current;
            if (value.hasOwnProperty('categorias')) {
              prev[key] = value;
            }
            return prev;
          },
          {}
        );
      }),
      map((response: Categorias) => {
        this.categorias = Object.values(response).map((categoria, index) => {
          const { labelCategorias } = categoria;
          return {
            ...categoria,
            labelCategorias,
            id: index,
          };
        });

        return this.categorias;
      })
    );
  }

  getCategorias() {
    if (this.categorias) return of(this.categorias);

    return this.structureCategorias();
  }

  getCategoriaById(id: string) {
    if (this.categorias) {
      const categoria = this.categorias.find(
        (categoria: any) => categoria.id == id
      );
      return of(categoria);
    }

    return this.getCategorias().pipe(
      switchMap((response) => {
        const categoria = response.find((categoria: any) => categoria.id == id);
        return of(categoria);
      })
    );
  }

  updateCategoria(id: number, body: Categoria) {
    const categoria = this.categorias.find(
      (categoria: any) => categoria.id == id
    );
    Object.assign(categoria, { ...body, id });
  }

  createCategoria(body: any) {
    if (this.categorias) {
      const index = this.categorias.reduce((prev: any, current: any) => {
        if (prev <= current.id) return current.id + 1;
        return prev;
      }, 0);

      body['id'] = index;
      this.categorias.push(body);
    } else {
      body['id'] = 0;
      this.categorias = [body];
    }
  }

  deleteCategoria(id: number) {
    const index = this.categorias.findIndex(
      (categoria: any) => categoria.id == id
    );
    this.categorias.splice(index, 1);
  }
}
