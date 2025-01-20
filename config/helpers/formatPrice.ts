export const formatPrice = (value: number | undefined): string => {
    if (value === undefined || isNaN(value)) {
      return '-'; // Retorna un valor por defecto si no hay un número válido
    }
    const formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${formattedValue}.-`;
  };
  