
export const formatImageUrl = (url: string): string => {
    if (!url) return '';
    return url.replace(':8080', ''); // Elimina el puerto ":8080" de la URL
  };
  