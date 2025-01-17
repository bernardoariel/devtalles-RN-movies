import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/config/helpers/colors';
import SearchInput from '@/presentation/components/products/SearchInput';

import { useProducts } from '@/presentation/hooks/useProducts';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import ResultsList from '@/presentation/components/products/resultsList';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<ProductsResponse[]>([]);
  const router = useRouter();

  const { productos } = useProducts();
  const { marcas } = useMarcas();

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      const filteredProductos = productos.filter((producto) =>
        producto.Producto?.toLowerCase().includes(term)
      );

      const filteredMarcas = marcas?.filter((marca) =>
        marca.Marca?.toLowerCase().includes(term)
      );

      setFilteredResults([...filteredProductos, ...(filteredMarcas || [])]);
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm, productos, marcas]);

  const handleClear = () => {
    setSearchTerm('');
    setFilteredResults([]);
  };

  const handleNavigate = () => {
    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) {
      console.log('El término de búsqueda está vacío.');
      return;
    }

    if (!isNaN(Number(trimmedTerm))) {
      router.push({
        pathname: `/product/[id]`,
        params: { id: trimmedTerm },
      });
    } else {
      router.push({
        pathname: `/product/products`,
        params: { searchTerm: trimmedTerm },
      });
    }
  };

  const handleResultClick = (id: string) => {
    router.push({
      pathname: `/product/[id]`,
      params: { id },
    });
  };

  return (
    <>
      <StatusBar backgroundColor={colors.primary.main} barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={handleClear}
            onNavigate={handleNavigate}
          />
        </View>
        <ResultsList results={filteredResults} onResultClick={handleResultClick} />
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.light,
  },
  header: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
});

export default HomeScreen;
