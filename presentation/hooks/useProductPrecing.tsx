import { formatPrice } from "@/config/helpers/formatPrice";
import { useMemo } from "react";


const useProductPricing = (precioLista: number) => {
    const precios = useMemo(() => {
        return {
          lista: precioLista,
          contado: precioLista * 0.82, // 18% de descuento
          debito: precioLista * 0.9, // 10% de descuento
        };
      }, [precioLista]);

    const preciosFormateados = useMemo(() => {
        return {
            lista: formatPrice(precios.lista),
            contado: formatPrice(precios.contado),
            debito: formatPrice(precios.debito),
        };
    }, [precios]);

    return { precios, preciosFormateados };
}

export default useProductPricing
