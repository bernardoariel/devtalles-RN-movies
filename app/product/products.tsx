import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { useProductByTerm } from '@/presentation/hooks/useProductByTerm';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import ProductCard from './productCard';
import { formatImageUrl } from '@/config/helpers/url.helper';
import { Ionicons } from '@expo/vector-icons';

const ProductsList = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('searchTerm') || '';
  const router = useRouter();

  const { productos, isLoading } = useProductByTerm(searchTerm);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="orange" />
        </Pressable>
        <Text style={styles.title}>Resultados para "{searchTerm}"</Text>
      </View>
      {isLoading ? (
        <Text style={styles.loading}>Cargando productos...</Text>
      ) : productos.length > 0 ? (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.scrollContent}
        >
          {productos.map((producto) => (
            <ProductCard
              key={producto.CodProducto}
              codProducto={producto.CodProducto}
              nombreProducto={producto.Producto}
              medida={producto.Medida}
              descripcion={producto.Descripcion}
              precio={producto.Precio}
              stock={producto.Stock}
              imageUrl={formatImageUrl(producto.Imagen)}
              onPress={() =>
                router.push({
                  pathname: `/product/[id]`,
                  params: { id: producto.CodProducto },
                })
              }
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10, // Espacio entre el botón y el título
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 40,
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
