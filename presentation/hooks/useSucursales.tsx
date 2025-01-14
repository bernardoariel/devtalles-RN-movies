import { abrilApi } from "@/app/core/api/movie-api";
import { SucursalResponse } from "@/infrastructure/interfaces/sucursales.interface";
import { useQuery } from "@tanstack/react-query";



export const getSucursales = async (): Promise<SucursalResponse[]> => {
    const { data } = await abrilApi.get<SucursalResponse[]>('/prod-sucursal'); // Asegúrate de configurar la URL base
    return data;
  };
  
  export const useSucursales = () => {
    const { data: sucursales, isLoading } = useQuery({
      queryKey: ['sucursales'],
      queryFn: getSucursales,
      staleTime: 1000 * 30, // Mantener en caché por 30 segundos
    });
  
    const findSucursalById = (id: number): SucursalResponse | undefined => {
      return sucursales?.find((sucursal) => sucursal.CodSucursal === id);
    };
  
    return {
      sucursales,
      isLoading,
      findSucursalById,
    };
  };