import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Keyboard, Dimensions, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useProducts } from '@/presentation/hooks/useProducts';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/config/helpers/colors';
import { useFocusEffect } from '@react-navigation/native'; 

 
const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filteredResults, setFilteredResults] = useState<ProductsResponse[]>([]); // Resultados filtrados
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  // Hook para productos
  const { productos, isLoading } = useProducts();
  const { marcas } = useMarcas();
  useFocusEffect(
    React.useCallback(() => {
      setSearchTerm(''); // Limpia el término
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus(); // Intenta enfocar el input
        }
      }, 100); // Garantiza un breve retraso
    }, [])
  );
  useEffect(() => {
    console.log('Resultados filtrados:', filteredResults);
  }, [filteredResults]);
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
  
    // Ejecuta la navegación
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
    console.log('Antes de limpiar:', searchTerm);
    setSearchTerm('');
    console.log('Después de limpiar:', searchTerm);
  };
  useEffect(() => {
    console.log('searchTerm actualizado:', searchTerm);
  }, [searchTerm]);

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
        <Ionicons name="search" size={20} color={colors.primary.main} style={styles.icon} />
          <TextInput
           ref={inputRef} 
            style={styles.input}
            placeholder="Buscar ..."
            placeholderTextColor={colors.primary.main}
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.roundButton} onPress={handleSearch}>
          <Ionicons name="play" size={20} color={colors.primary.dark} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Cargando productos...</Text>
      ) : filteredResults.length > 0 ? (
        <ScrollView
          style={styles.dropdown}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          {filteredResults.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleResultClick(item)}
              style={styles.listItemContainer}
            >
              <Text style={styles.listItem}>
                {item.Producto ? `${item.Producto} - ${item.CodProducto}` : `${item.Marca}`}
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
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary.dark,
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
    borderColor: colors.primary.main,
    borderRadius: 25,
    backgroundColor: colors.primary.light,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.primary.dark,
  },
  roundButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary.main,
    borderRadius: 5,
    backgroundColor: colors.primary.light,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  listItemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.main,
  },
  listItem: {
    color: colors.primary.dark,
    fontSize: 16,
  },
  loading: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.primary.main,
  },
});


export default SearchProduct;
