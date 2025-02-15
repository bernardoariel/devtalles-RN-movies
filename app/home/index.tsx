import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Provider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '@/config/helpers/colors';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import ResultsList from '@/presentation/components/products/resultsList';
import Header from '@/presentation/components/common/Header';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<ProductsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { productos } = useProducts();
  const { marcas } = useMarcas();

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      setIsLoading(true);

      setTimeout(() => {
        const filteredProductos = productos.filter((producto) =>
          producto.Producto?.toLowerCase().includes(term)
        );

        const filteredMarcas = marcas?.filter((marca) =>
          marca.Marca?.toLowerCase().includes(term)
        );

        setFilteredResults([...filteredProductos, ...(filteredMarcas || [])]);
        setIsLoading(false);
      }, 500);
    } else {
      setFilteredResults([]);
      setIsLoading(false);
    }
  }, [searchTerm, productos, marcas]);

  const handleClear = () => {
    setSearchTerm('');
    setFilteredResults([]);
  };

  const handleNavigate = () => {
    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) return;

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

  const handleResultClick = (term: number | string) => {
    if (!isNaN(Number(term))) {
      router.push({
        pathname: `/product/[id]`,
        params: { id: term.toString() },
      });
    } else {
      router.push({
        pathname: `/product/products`,
        params: { searchTerm: term, searchByMarcas: 'true' },
      });
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login');
  };

  return (
    <Provider>
      <StatusBar backgroundColor={colors.primary.main} barStyle="light-content" />
      <View style={styles.container}>
      <Header
  searchTerm={searchTerm}
  onChangeSearchTerm={setSearchTerm}
  onClear={handleClear}
  onNavigate={handleNavigate}
  onLogout={handleLogout}
  showSearch
/>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text>Cargando resultados...</Text>
          </View>
        ) : (
          <ResultsList results={filteredResults} onResultClick={handleResultClick} />
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
