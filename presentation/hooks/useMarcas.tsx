import { abrilApi } from "@/app/core/api/movie-api";
import { MarcasResponse } from "@/infrastructure/interfaces/marcas.interface";
import { useQuery } from "@tanstack/react-query";

const fetchMarcas = async (): Promise<MarcasResponse[]> => {
    const { data } = await abrilApi.get<MarcasResponse[]>('/prod-marca'); // Configura la URL base en Axios
    return data;
  };
  
  export const useMarcas = () => {
    const { data: marcas, isLoading } = useQuery({
      queryKey: ['marcas'],
      queryFn: fetchMarcas,
      staleTime: 1000 * 30, // Mantener en caché por 30 segundos
    });
  
    const findMarcasById = (id: number): MarcasResponse | undefined => {
      return marcas?.find((marca) => marca.CodMarca === id);
    };
  
    return {
      marcas,
      isLoading,
      findMarcasById,
    };
  };