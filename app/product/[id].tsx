import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Share, Modal } from 'react-native';
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
import colors from '@/config/helpers/colors';
import { formatPrice } from '@/config/helpers/formatPrice';
import { Button } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

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
      *${producto.Producto}*
      ${producto.Descripcion}
      📏 Medida: ${producto.Medida}
      💰 Precio: ${formatPrice(producto.Precio)}
      🏪 Stock: ${producto.Stock > 0 ? `${producto.Stock} unidades` : 'Sin stock'}
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
            <h1>${producto.Producto}</h1>
            <p>${producto.Descripcion}</p>
            <p><strong>Medida:</strong> ${producto.Medida}</p>
            <p><strong>Precio:</strong> ${formatPrice(producto.Precio)}</p>
            <p><strong>Stock:</strong> ${producto.Stock > 0 ? `${producto.Stock} unidades` : 'Sin stock'}</p>
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header con imagen, botón de retroceso y código del producto */}
        <ProductHeader imageUrl={imageUrl} onBack={() => router.back()} productCode={producto.CodProducto} />

        {/* Botón de Compartir */}
        <Button mode="contained" onPress={() => setModalVisible(true)} color={colors.primary.main} style={{ margin: 16 }}>
          Compartir
        </Button>

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
      <View style={styles.fixedDetailsContainer}>
        <Text style={styles.priceText}>Precio de lista {formatPrice(producto.Precio)}</Text>
      </View>

      {/* Modal para elegir el tipo de compartición */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Cómo quieres compartir?</Text>
            <Button mode="contained" onPress={handleTextShare} style={{ marginVertical: 10 }}>
              Compartir como Texto
            </Button>
            <Button mode="contained" onPress={handlePDFShare} style={{ marginVertical: 10 }}>
              Compartir como PDF
            </Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)}>
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
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
