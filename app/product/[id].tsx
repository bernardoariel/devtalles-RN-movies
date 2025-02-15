import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Share, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct } from '../../presentation/hooks/useProducto';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ProductImageViewer from '@/presentation/components/products/ProductImageViewer';
import ProductDetails from '@/presentation/components/products/ProductDetails';
import ProductAvailability from '@/presentation/components/products/ProductAvailability';
import { useFormaPagoPlanes } from '@/presentation/hooks/useFormaPagoPlanes';
import { useFormaPago } from '@/presentation/hooks/useFormaPago';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { useSucursales } from '@/presentation/hooks/useSucursales';
import { formatImageUrl } from '@/config/helpers/url.helper';
import ProductPricing from '@/presentation/components/products/productPricing';
import colors from '@/config/helpers/colors';
import { formatPrice } from '@/config/helpers/formatPrice';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/presentation/components/common/Header';
import { FlatList } from 'react-native-gesture-handler';

const ProductScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { formaPagoPlanes } = useFormaPagoPlanes();
  const { findFormaPagoById } = useFormaPago();
  const { producto, isLoading, isError } = useProduct({ id: Number(id) });
  const { findMarcasById } = useMarcas();
  const { findSucursalById } = useSucursales();
  
  const [modalVisible, setModalVisible] = useState(false);
  const imageUrl = formatImageUrl(producto?.Imagen ?? "");

  const handleTextShare = async () => {
    const message = `
      *${producto!.Producto}*
      ${producto!.Descripcion}
      📏 Medida: ${producto!.Medida}
      💰 Precio: ${formatPrice(producto!.Precio)}
      🏪 Stock: ${producto!.Stock > 0 ? `${producto!.Stock} unidades` : 'Sin stock'}
    `;

    await Share.share({ message });
    setModalVisible(false);
  };

  const handlePDFShare = async () => {
    try {
      const imageUri = await FileSystem.downloadAsync(imageUrl, FileSystem.cacheDirectory + 'producto.jpg');

      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1>${producto!.Producto}</h1>
            <p>${producto!.Descripcion}</p>
            <p><strong>Medida:</strong> ${producto!.Medida}</p>
            <p><strong>Precio:</strong> ${formatPrice(producto!.Precio)}</p>
            <p><strong>Stock:</strong> ${producto!.Stock > 0 ? `${producto!.Stock} unidades` : 'Sin stock'}</p>
            <img src="${imageUri.uri}" style="width: 100%; height: auto; margin-top: 10px; border-radius: 10px;" />
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Error al compartir PDF:', error);
    }
    setModalVisible(false);
  };

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
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login');
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header
          title={producto.Producto}
          onLogout={handleLogout}
          onBackPress={() => router.back()}
          titleSize={12}
          showSearch={false}
          extraMenuItems={[
            { label: 'Compartir como Texto', action: handleTextShare, icon: 'share-variant' },
            { label: 'Compartir como PDF', action: handlePDFShare, icon: 'file' },
          ]}
        />
        <FlatList
          ListHeaderComponent={
            <>
              <ProductImageViewer imageUrl={imageUrl} />
              <ProductDetails producto={producto} findMarcasById={findMarcasById} />
              <ProductAvailability sucursales={producto.Sucursales} findSucursalById={findSucursalById} />
              <ProductPricing
                Producto={producto.Producto}
                Precio={producto.Precio}
                formaPagoPlanes={formaPagoPlanes!}
                findFormaPagoById={findFormaPagoById}
              />
            </>
          }
          data={[]} // No necesitamos datos porque solo usamos el encabezado
          renderItem={null}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
        <View style={styles.fixedDetailsContainer}>
          <Text style={styles.priceText}>Precio de lista {formatPrice(producto.Precio)}</Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  scrollView: {
  marginTop: -16, // Empuja la imagen hacia arriba para que se superponga con el Header
},
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
  fixedDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary.main,
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral.dark,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
