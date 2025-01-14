import { abrilApi } from '@/app/core/api/movie-api';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import { useQuery } from '@tanstack/react-query';

export interface ProductsApiResponse {
  total: number; // El total de productos en la API
  result: ProductsResponse[]; // El array de productos
}
const getProducts = async (): Promise<ProductsResponse[]> => {
  try {
    const { data }: { data: ProductsApiResponse } = await abrilApi.get('/productos');
    console.log('Respuesta completa de la API:', data);

    // Devuelve el array `result` si está presente; de lo contrario, un array vacío
    return Array.isArray(data.result) ? data.result : [];
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return [];
  }
};

export const useProducts = () => {
  const { data: productos, isLoading } = useQuery<ProductsResponse[]>({
    queryKey: ['productos'],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30, // Los datos se consideran frescos por 30 minutos
    retry: false,
  });

  return {
    productos: productos ?? [], // Devuelve un array vacío si no hay datos
    isLoading,
  };
};