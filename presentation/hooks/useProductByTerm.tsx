import { useQuery } from '@tanstack/react-query';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import { abrilApi } from '@/app/core/api/movie-api';

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

export const useProductByTerm = (term: string) => {
  const { data: productos, isLoading } = useQuery<ProductsResponse[]>({
    queryKey: ['productosByTerm', term],
    queryFn: () => getProductsByTerm(term),
    enabled: term.trim() !== '', // Solo se ejecuta si hay un término válido
  });

  return {
    productos: productos ?? [], // Devuelve un array vacío si no hay datos
    isLoading,
  };
};
