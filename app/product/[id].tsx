import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Share } from 'react-native';
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
import Header from '@/presentation/components/common/Header';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import useProductPricing from '@/presentation/hooks/useProductPrecing';

interface SelectedCuota {
  NCuota: number;
  total: string;
  importeCuota: string;
  formaPago: string;
}

const ProductScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { formaPagoPlanes } = useFormaPagoPlanes();
  const { findFormaPagoById } = useFormaPago();
  const { producto, isLoading, isError } = useProduct({ id: Number(id) });
  const { preciosFormateados } = useProductPricing(producto?.Precio ?? 0);
  const { findMarcasById } = useMarcas();
  const { findSucursalById } = useSucursales();
  
  const [selectedCuotas, setSelectedCuotas] = useState<SelectedCuota[]>([]);
  const imageUrl = formatImageUrl(producto?.Imagen ?? "");

  const handleTextShare = async () => {
    const fecha = new Date().toLocaleDateString();
  
    const cuotasText = selectedCuotas.length
  ? `- * - * - *\n💳 Formas de pago:\n${selectedCuotas.map((c, i) => {
      const formaPago = c.formaPago.replace(/\./g, ' ');
      return `**Opción ${i + 1}:** ${c.NCuota} ${c.NCuota === 1 ? "cuota" : "cuotas"} de ${c.importeCuota} con ${formaPago}`;
    }).join("\n")}\n`
  : "";

    const message = `
      *${producto!.Producto}*
      ${producto!.Descripcion}
      📏 Medida: ${producto!.Medida} | 🏷️ Marca: ${findMarcasById(producto!.CodMarca)?.Marca || "Sin marca"}
      💰 Lista: ${preciosFormateados.lista} | 💳 Débito: ${preciosFormateados.debito} | 💵 Contado: ${preciosFormateados.contado}
      ${cuotasText}
      📅 Fecha de consulta: ${fecha}
      ❤️ Abril vive en vos!!!
      Sujeto a modificación sin previo aviso
    `;
  
    await Share.share({ message });
  };
  

  const handlePDFShare = async () => {
    try {
      const fecha = new Date().toLocaleDateString();
      let base64Image = null;
      const fileUri = FileSystem.documentDirectory + 'producto.jpg';

      if (imageUrl && imageUrl.startsWith("http")) {
        try {
          await FileSystem.downloadAsync(imageUrl, fileUri);
          base64Image = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        } catch (error) {
          console.warn("No se pudo descargar la imagen, se generará el PDF sin ella.");
        }
      }

      const cuotasHTML = selectedCuotas.length
  ? `
    <hr/>
    <p><strong>💳 Formas de pago:</strong></p>
    <p>${selectedCuotas.map((c, i) => {
      const formaPago = c.formaPago.replace(/\./g, ' ');
      return `<strong>Opción ${i + 1}:</strong> ${c.NCuota} ${c.NCuota === 1 ? "cuota" : "cuotas"} de ${c.importeCuota} con ${formaPago}`;
    }).join("<br/>")}</p>
  `
  : "";


        const html = `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>Presupuesto - Fecha: ${fecha}</h2>
            <h1>${producto!.Producto}</h1>
            <h2>${producto!.CodProducto}</h2>
            <p>${producto!.Descripcion}</p>
            <p><strong> 📏 Medida:</strong> ${producto!.Medida} | 🏷️ <strong>Marca:</strong> ${findMarcasById(producto!.CodMarca)?.Marca || "Sin marca"}</p>
            <p><strong> 💰 Precios:</strong> Lista ${preciosFormateados.lista} | Débito ${preciosFormateados.debito} | Contado ${preciosFormateados.contado}</p>
            <p><strong> 🏪 Stock:</strong> ${producto!.Stock > 0 ? `${producto!.Stock} unidades` : 'Sin stock'}</p>
            <p><strong> 📅 Fecha de consulta:</strong> ${fecha}</p>
            ${cuotasHTML}
            ${base64Image ? `<img src="data:image/jpeg;base64,${base64Image}" style="width: 50%; height: auto; margin-top: 10px; border-radius: 10px;" />` : ""}
            <p style="font-size: 16px; color: #FF8C00; margin-top: 20px;">❤️ Abril vive en vos!!!</p>
            <p style="font-size: 10px; color: #777; margin-top: 10px;">Sujeto a modificación sin previo aviso</p>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header
          title={producto.Producto}
          onBackPress={() => router.back()}
          showSearch={false}
          extraMenuItems={[
            { label: 'Compartir como Texto', action: handleTextShare, icon: <Ionicons name="share-social" size={24} color="#555" /> },
            { label: 'Compartir como PDF', action: handlePDFShare, icon: <Ionicons name="document-text" size={24} color="#555" /> },
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
                onSelectCuotas={setSelectedCuotas} 
              />
            </>
          }
          data={[]} 
          renderItem={null}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
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
