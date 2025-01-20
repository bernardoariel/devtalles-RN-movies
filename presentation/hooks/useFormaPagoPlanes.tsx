import { abrilApi } from "@/app/core/api/movie-api";
import { useQuery } from "@tanstack/react-query";
export interface FormaPagoPlanes {
    CodForPago: string;
    NCuota: number;
    Interes: number;
    Punitorio: number;
    Coeficiente: number;
    Puntos: number;
    Nombre?: string | null;
  }
  
  const fetchFormaPagoPlanes = async (): Promise<FormaPagoPlanes[]> => {
    const { data } = await abrilApi.get<FormaPagoPlanes[]>('/forma-pago-planes');
    return data;
  };
  
  export const useFormaPagoPlanes = () => {
    const { isLoading, data: formaPagoPlanes } = useQuery({
      queryKey: ['forma-pago-planes'],
      queryFn: fetchFormaPagoPlanes,
      staleTime: 1000 * 30, // Mantén los datos frescos durante 30 segundos
    });
  
    const findFormaPagoById = (id: string): FormaPagoPlanes | undefined => {
      return formaPagoPlanes?.find((plan) => plan.CodForPago === id);
    };
  
    return {
      isLoading,
      formaPagoPlanes,
      findFormaPagoById,
    };
  };
  