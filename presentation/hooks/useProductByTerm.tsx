import { useQuery } from '@tanstack/react-query';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import { abrilApi } from '@/app/core/api/movie-api';
interface GetProductsOptions {
  term: string;
}

const getProductsByTerm = async (term: string): Promise<ProductsResponse[]> => {
  if (!term.trim()) {
    return [];
  }

  try {
    const { data }: { data: ProductsResponse[] } = await abrilApi.get(`/productos/${term}`);
    return data;
  } catch (error) {
    console.error('Error al buscar productos por término:', error);
    return [];
  }
};
export const getProductByMarcas = async ({ term }: GetProductsOptions) => {
  try {
    // console.log('Fetching marcas with term: ', term);
    const { data } = await abrilApi.get(`productos/${term}/marcas`);
    return data;
  } catch (error) {
    console.error('Error fetching products for marca:', error);
    throw error;
  }
};
export const useProductByTerm = (term: string,searchByMarcas:string = 'false') => {
  const { data: productos, isLoading } = useQuery<ProductsResponse[]>({
    queryKey: ['producto', term, searchByMarcas ? 'marcas' : 'productos'],
    queryFn: () => {
      if (searchByMarcas) {
        return getProductByMarcas({ term });
      } else {
        return getProductsByTerm(term);
      }
    },
    enabled: term.trim() !== '', // Solo se ejecuta si hay un término válido
  });

  return {
    productos: productos ?? [], // Devuelve un array vacío si no hay datos
    isLoading,
  };
};
