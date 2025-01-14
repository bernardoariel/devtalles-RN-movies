export interface ProductsResponse {
    CodProducto: string;
    Producto: string;
    Medida: string;
    Descripcion: string;
    Stock: number;
    CodMarca: number;
    CodRubro: number | null;
    CodCategoria: number;
    Precio: number;
    Imagen: null | string;
    Sucursales: Sucursales[];
  }
  
  export interface Sucursales {
    CodSucursal: number;
    Cantidad: number;
  }
  