import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useProductByTerm } from '@/presentation/hooks/useProductByTerm';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import ProductCard from './productCard';
import { formatImageUrl } from '@/config/helpers/url.helper';

import { useMarcas } from '@/presentation/hooks/useMarcas';
import Header from '@/presentation/components/common/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductsList = () => {
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('searchTerm') || '';
  const searchByMarcas = searchParams.get('searchByMarcas') || false;

  const router = useRouter();
  const { productos, isLoading } = useProductByTerm(searchTerm, searchByMarcas);
  const { marcas } = useMarcas(); // Hook para obtener las marcas
  // Control para manejar el desfase:
  const shouldRenderProducts = !isLoading && searchTerm.trim().length > 0;

  const uniqueMarcas = marcas?.filter((marca) =>
    productos.some((prod) => prod.CodMarca === marca.CodMarca)
  );

  // Filtrar productos por marca seleccionada
  const filteredProducts = selectedMarca
    ? productos.filter((prod) => prod.CodMarca === selectedMarca)
    : productos;

  // Contar productos por marca
  const countProductsByMarca = (CodMarca: number) => {
    return productos.filter((prod) => prod.CodMarca === CodMarca).length;
  };
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login');
  };
  return (
    <View style={styles.container}>
      {/* Botones de marcas */}
      <Header
        title="Lista de Productos"
        onLogout={handleLogout}
        onBackPress={() => router.back()}
        showSearch={false}
      />

      <ScrollView
        horizontal
        style={styles.marcasContainer}
        showsHorizontalScrollIndicator={false}
      >
        {uniqueMarcas?.map((marca) => (
          <TouchableOpacity
            key={marca.CodMarca}
            style={[
              styles.marcaButton,
              selectedMarca === marca.CodMarca && styles.marcaButtonActive,
            ]}
            onPress={() =>
              setSelectedMarca((prev) =>
                prev === marca.CodMarca ? null : marca.CodMarca
              )
            }
          >
            <Text
              style={[
                styles.marcaText,
                selectedMarca === marca.CodMarca && styles.marcaTextActive,
              ]}
            >
              {marca.Marca}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {countProductsByMarca(marca.CodMarca)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de productos */}
      {isLoading && (
  <View style={styles.loadingContainer}>
    <Text style={styles.loading}>Cargando productos...</Text>
  </View>
)}

      {!isLoading && filteredProducts.length > 0 && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredProducts.map((producto) => (
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
      {!isLoading && filteredProducts.length === 0 && (
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
  marcasContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  marcasInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centrar botones si hay pocos
    flexWrap: 'nowrap', // Asegura que no se envuelvan
  },
  marcaButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100, // Tamaño mínimo para botones consistentes
    height: 50,
    justifyContent: 'space-between',
  },
  marcaButtonActive: {
    backgroundColor: '#FF6F00',
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  marcaText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1, // Permite que el texto se ajuste sin romper el diseño
  },
  marcaTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#FF8C00',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    height: 24, // Tamaño fijo para evitar cortes
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 8,
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
  loadingContainer: {
    flex: 1, // Ocupar toda la pantalla
    justifyContent: 'flex-start', // Alinear elementos desde arriba
    alignItems: 'center', // Centrar horizontalmente
    paddingTop: '20%', // Mueve el texto al 20% de la altura de la pantalla
    backgroundColor: '#fff', // Fondo blanco para consistencia
  },
});


export default ProductsList;
