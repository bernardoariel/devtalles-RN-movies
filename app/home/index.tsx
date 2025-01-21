import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '@/config/helpers/colors';
import SearchInput from '@/presentation/components/products/SearchInput';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import ResultsList from '@/presentation/components/products/resultsList';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<ProductsResponse[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
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
      }, 500); // Simulación de retraso para que se note el loading
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
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image
              source={require('@/assets/images/abrilCuore.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Buscador de Precios</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={styles.menuButton}
                >
                  <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={handleLogout} title="Cerrar Sesión" />
            </Menu>
          </View>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={handleClear}
            onNavigate={handleNavigate}
          />
        </View>
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
  header: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral.dark,
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.neutral.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
