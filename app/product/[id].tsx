import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct } from '../../presentation/hooks/useProducto';
import ProductHeader from '@/presentation/components/products/ProductHeader';
import ProductImageViewer from '@/presentation/components/products/ProductImageViewer';
import ProductDetails from '@/presentation/components/products/ProductDetails';
import ProductAvailability from '@/presentation/components/products/ProductAvailability';
import { useFormaPagoPlanes } from '@/presentation/hooks/useFormaPagoPlanes';
import { useFormaPago } from '@/presentation/hooks/useFormaPago';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { useSucursales } from '@/presentation/hooks/useSucursales';
import { formatImageUrl } from '@/config/helpers/url.helper';
import ProductPricing from '@/presentation/components/products/productPricing';

const ProductScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { formaPagoPlanes } = useFormaPagoPlanes();
  const { findFormaPagoById } = useFormaPago();
  const { producto, isLoading, isError } = useProduct({ id: Number(id) });
  const { findMarcasById } = useMarcas();
  const { findSucursalById } = useSucursales();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando producto...</Text>
        <ActivityIndicator color="#FF8C00" size="large" />
      </View>
    );
  }

  if (isError || !producto) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar el producto.</Text>
      </View>
    );
  }

  const imageUrl = formatImageUrl(producto?.Imagen ?? "");


  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header con imagen, botón de retroceso y código del producto */}
        <ProductHeader imageUrl={imageUrl} onBack={() => router.back()} productCode={producto.CodProducto} />

        {/* Imagen con opción de zoom */}
        <ProductImageViewer imageUrl={imageUrl} />

        {/* Detalles del producto */}
        <ProductDetails producto={producto} findMarcasById={findMarcasById} />

        {/* Disponibilidad en sucursales */}
        <ProductAvailability sucursales={producto.Sucursales} findSucursalById={findSucursalById} />

        {/* Precios y métodos de pago */}
        <ProductPricing
          Producto={producto.Producto}
          Precio={producto.Precio}
          formaPagoPlanes={formaPagoPlanes!}
          findFormaPagoById={findFormaPagoById}
        />
      </ScrollView>
    </View>
  );
};

export default ProductScreen;
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    marginBottom: 10,
  },
});
