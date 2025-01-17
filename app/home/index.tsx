import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import colors from '@/config/helpers/colors';
import SearchInput from '@/presentation/components/products/SearchInput';
import ResultContainer from '@/presentation/components/products/ResultContainer';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';

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

  const handleResultClick = (result: ProductsResponse) => {
    // Navega a otra pantalla con el ID del producto o cualquier otra información
    router.push({
      pathname: `/product/[id]`,
      params: { id: result.CodProducto },
    });
  };

  // Limpia el término de búsqueda y los resultados al enfocar la pantalla
  useFocusEffect(
    React.useCallback(() => {
      setSearchTerm('');
      setFilteredResults([]);
    }, [])
  );

  return (
    <>
      <StatusBar backgroundColor={colors.primary.main} barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </View>
        <ResultContainer results={filteredResults} onResultClick={handleResultClick} />
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
