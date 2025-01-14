import { abrilApi } from "@/app/core/api/movie-api";
import { FormaPago } from "@/infrastructure/interfaces/forma-pago.interface";
import { useQuery } from "@tanstack/react-query";

const fetchFormaPago = async (): Promise<FormaPago[]> => {
    const { data } = await abrilApi.get<FormaPago[]>('/forma-pago'); // Configura la URL base en Axios
    return data;
  };
  
  export const useFormaPago = () => {
    const { data: formaPago, isLoading } = useQuery({
      queryKey: ['forma-pagos'],
      queryFn: fetchFormaPago,
      staleTime: 1000 * 30, // Mantener en caché por 30 segundos
    });
  
    const findFormaPagoById = (CodForPago: string): FormaPago | undefined => {
      return formaPago?.find((pago) => pago.CodForPago === CodForPago);
    };
  
    return {
      formaPago,
      isLoading,
      findFormaPagoById,
    };
  };