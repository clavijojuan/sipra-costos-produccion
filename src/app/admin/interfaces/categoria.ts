export interface Categoria {
  categorias: string[];
  labelCategorias: string;
}

export interface Categorias {
  [key: string]: Categoria;
}
