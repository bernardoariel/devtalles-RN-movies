import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import React from 'react';
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
  console.log('searchByMarcas::: ', searchByMarcas);

  const router = useRouter();
  const { productos, isLoading } = useProductByTerm(searchTerm, searchByMarcas);

  return (
    <View style={styles.container}>
      <Header
        title={`Resultados para "${searchTerm}"`}
        onBackPress={() => router.back()}
      />
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
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight!  : 1, // Ajusta para no superponer al Header
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
