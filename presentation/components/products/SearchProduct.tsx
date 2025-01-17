import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useProducts } from '@/presentation/hooks/useProducts';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { Ionicons } from '@expo/vector-icons';


const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filteredResults, setFilteredResults] = useState<ProductsResponse[]>([]); // Resultados filtrados
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const router = useRouter();

  // Hook para productos
  const { productos, isLoading } = useProducts();
  const { marcas } = useMarcas();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() && isNaN(Number(searchTerm))) {
      const term = searchTerm.toLowerCase();

      // Filtrar productos
      const filteredProductos = productos.filter((producto) =>
        producto.Producto?.toLowerCase().includes(term)
      );

      // Filtrar marcas
      const filteredMarcas = marcas?.filter((marca) =>
        marca.Marca?.toLowerCase().includes(term)
      );

      // Combinar resultados de productos y marcas
      const combinedResults = [...filteredProductos, ...(filteredMarcas || [])];

      // Actualizar el estado solo si los resultados son diferentes
      if (
        combinedResults.length !== filteredResults.length ||
        !combinedResults.every((result, index) => result === filteredResults[index])
      ) {
        setFilteredResults(combinedResults);
      }
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm, productos, marcas]);

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) {
      console.log("El término de búsqueda está vacío.");
      return; // No hacer nada si el término está vacío
    }

    if (!isNaN(Number(trimmedTerm))) {
      // Si es un número, navegar al producto por ID
      router.push({
        pathname: `/product/[id]`,
        params: { id: trimmedTerm },
      });
    } else {
      // Si es texto, navegar a una lista de productos filtrados
      router.push({
        pathname: `/product/products`,
        params: { searchTerm: trimmedTerm },
      });
    }
  };

  const handleResultClick = (result: ProductsResponse) => {
    router.push({
      pathname: `/product/[id]`,
      params: { id: result.CodProducto },
    });
  };

  const extraMargin = 20; // Descuento adicional
  const dropdownHeight = screenHeight - keyboardHeight - 150 - extraMargin;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar...</Text>

      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar ..."
            placeholderTextColor="#999"
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
          />
        </View>
        <TouchableOpacity style={styles.roundButton} onPress={handleSearch}>
          <Ionicons name="play" size={20} color="orange" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Cargando productos...</Text>
      ) : filteredResults.length > 0 ? (
        <ScrollView
          style={[styles.dropdown, { maxHeight: dropdownHeight }]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {filteredResults.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleResultClick(item)}>
              <Text style={styles.listItem}>
                {'CodProducto' in item
                  ? `${item.Producto} - ${item.CodProducto}`
                  : `${item.Marca}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResults}></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    position: 'relative', // Importante para la lista desplegable
    zIndex: 1, // Asegura que el dropdown se muestre encima
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCB800',
    borderRadius: 25,
    backgroundColor: '#FFE5B4',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    color: '#FCB800',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#6B4226',
  },
  roundButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#FFE5B4', // Fondo blanco
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#FCB800', // Borde naranja fuerte para mantener consistencia
    marginBottom: 10,
  },
  dropdown: {
    position: 'absolute', // Superpone el dropdown
    top: 100, // Ajusta la posición desde la parte superior del input
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 5,
    backgroundColor: '#FFF8E7',
    maxHeight: 250, // Altura máxima de la lista
    zIndex: 2, // Prioridad sobre otros elementos
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FCB800',
    color: '#444',
  },
  loading: {
    marginTop: 10,
    textAlign: 'center',
    color: '#FCB800',
  },
  noResults: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
  },
});

export default SearchProduct;
