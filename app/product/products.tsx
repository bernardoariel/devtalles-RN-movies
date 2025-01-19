import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import { useProductByTerm } from '@/presentation/hooks/useProductByTerm';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import ProductCard from './productCard';
import { formatImageUrl } from '@/config/helpers/url.helper';
import Header from '@/presentation/components/products/HeaderComponent';

const ProductsList = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('searchTerm') || '';
  const searchByMarcas = searchParams.get('searchByMarcas') || false;

  const router = useRouter();
  const { productos, isLoading } = useProductByTerm(searchTerm, searchByMarcas);

  // Control para manejar el desfase:
  const shouldRenderProducts = !isLoading && searchTerm.trim().length > 0;

  return (
    <View style={styles.container}>
      <Header
        title={`Resultados para "${searchTerm}"`}
        onBackPress={() => router.back()}
      />
      {isLoading && (
        <Text style={styles.loading}>Cargando productos...</Text>
      )}
      {!isLoading && searchTerm.trim().length === 0 && (
        <Text style={styles.prompt}>Escribe algo para buscar productos.</Text>
      )}
      {shouldRenderProducts && productos.length > 0 && (
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
      )}
      {shouldRenderProducts && productos.length === 0 && (
        <Text style={styles.noResults}>No hay productos encontrados</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight! : 1, // Ajusta para no superponer al Header
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
  prompt: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ProductsList;
