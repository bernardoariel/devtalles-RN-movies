import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

import { useProductByTerm } from '@/presentation/hooks/useProductByTerm'; // Hook nuevo
import { useSearchParams } from 'expo-router/build/hooks';

const ProductsList = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('searchTerm') || ''; // Obtiene 'searchTerm' de los parámetros de URL

  const { productos, isLoading } = useProductByTerm(searchTerm); // Usa el nuevo hook

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados para "{searchTerm}"</Text>
      {isLoading ? (
        <Text style={styles.loading}>Cargando productos...</Text>
      ) : productos.length > 0 ? (
        <ScrollView style={styles.list}>
          {productos.map((producto) => (
            <Text key={producto.CodProducto} style={styles.item}>
              {producto.Producto} - {producto.CodProducto}
            </Text>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResults}>No hay productos encontrados</Text>
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
  list: {
    marginTop: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default ProductsList;
