import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useProducts } from '@/presentation/hooks/useProducts';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';
import { useMarcas } from '@/presentation/hooks/useMarcas';

const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filteredResults, setFilteredResults] = useState<ProductsResponse[]>([]); // Resultados filtrados
  const router = useRouter();

  // Hook para productos
  const { productos, isLoading } = useProducts();
  const { marcas } = useMarcas()
  useEffect(() => {
    console.log('Término de búsqueda:', searchTerm);
  
    if (searchTerm.trim() && isNaN(Number(searchTerm))) {
      const term = searchTerm.toLowerCase();
      console.log('Término transformado:', term);
  
      // Filtrar productos
      const filteredProductos = productos.filter((producto) =>
        producto.Producto?.toLowerCase().includes(term)
      );
  
      console.log('Productos filtrados:', filteredProductos);
  
      // Filtrar marcas
      const filteredMarcas = marcas!.filter((marca) =>
        marca.Marca?.toLowerCase().includes(term)
      );
  
      console.log('Marcas filtradas:', filteredMarcas);
  
      // Combinar resultados de productos y marcas
      const combinedResults = [...filteredProductos, ...filteredMarcas];
  
      console.log('Resultados combinados:', combinedResults);
  
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

    if (trimmedTerm && !isNaN(Number(trimmedTerm))) {
      // Búsqueda por ID
      router.push({
        pathname: `/product/[id]`,
        params: { id: trimmedTerm },
      });
    }
  };

  const handleResultClick = (result: ProductsResponse) => {
    console.log('Producto seleccionado:', result);
    router.push({
      pathname: `/product/[id]`,
      params: { id: result.CodProducto },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Producto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Producto o ID"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />

      <Button title="Buscar Producto" onPress={handleSearch} />

      {isLoading ? (
        <Text style={styles.loading}>Cargando productos...</Text>
      ) : filteredResults.length > 0 ? (
        <ScrollView style={styles.dropdown}>
  {filteredResults.map((item, index) => (
    <TouchableOpacity key={index} onPress={() => handleResultClick(item)}>
      <Text style={styles.listItem}>
        {'CodProducto' in item
          ? `${item.Producto} - ${item.CodProducto}` // Muestra producto y código
          : `${item.Marca}`} // Muestra marca
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
      ) : (
        <Text style={styles.noResults}>No hay resultados</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loading: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  noResults: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
  },
});

export default SearchProduct;
