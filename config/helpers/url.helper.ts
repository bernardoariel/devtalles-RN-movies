
export const formatImageUrl = (url: string): string => {
    if (!url) return '';
    const updatedUrl = url.replace(':8080', '').replace('http://', 'https://');
    return updatedUrl;

  };
  