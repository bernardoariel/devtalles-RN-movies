
import { useQuery } from "@tanstack/react-query"
import { abrilApi } from '../../app/core/api/movie-api';
import { Producto } from "@/infrastructure/interfaces/producto.interface";


interface Options {
  id: number;
}
export const getProductById = async (term: number | string): Promise<Producto> => {
  try {
    const { data } = await abrilApi.get<Producto>(`/productos/${term}`);
    if (!data) {
      throw new Error('Producto no encontrado');
    }
    return data;
  } catch (error) {
    console.error('Error fetching product by term: ', error);
    throw error;
  }
};
export const useProduct = ({ id }: Options) => {
  const {
    isLoading,
    isError,
    error,
    data: producto,
    isFetching,
  } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => getProductById(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    retry: false,
  });
  return {
    error,
    isError,
    isFetching,
    isLoading,
    producto: producto ?? [],
  };
};
