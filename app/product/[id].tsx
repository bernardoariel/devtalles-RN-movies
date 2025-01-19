import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct } from '../../presentation/hooks/useProducto';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatImageUrl } from '../../config/helpers/url.helper';
import colors from '@/config/helpers/colors';

const screenHight = Dimensions.get('window').height;

const ProductScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { producto, isLoading, isError } = useProduct({ id: Number(id) });

  const imageUrl = formatImageUrl(producto?.Imagen);

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
        <Pressable onPress={() => router.reload()} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView>
      {/* Contenedor de la imagen con gradiente, botón y badges */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
        {/* Badge del código */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{producto.CodProducto}</Text>
        </View>
        {/* Gradiente */}
        <LinearGradient
          colors={['rgba(255,165,0,0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
        {/* Botón de volver */}
        <View style={styles.backButton}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="#FF8C00" />
          </Pressable>
        </View>
      </View>

      {/* Badge del stock entre la imagen y el siguiente div */}
      <View style={styles.stockBadge}>
        <Text style={styles.stockBadgeText}>{producto.Stock > 0 ? `Stock: ${producto.Stock}` : 'Sin stock'}</Text>
      </View>

      {/* Información del producto */}
      <View style={styles.productInfoContainer}>
        <Text style={styles.productTitle}>{producto.Producto}</Text>
        <Text style={styles.productDescription}>{producto.Descripcion}</Text>
      </View>

      {/* Detalles del producto */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Detalles:</Text>
        <Text style={styles.detail}>Precio: ${producto.Precio}</Text>
        <Text style={styles.detail}>Medida: {producto.Medida}</Text>
        <Text style={styles.detail}>Categoría: {producto.CodCategoria}</Text>
        <Text style={styles.detail}>Marca: {producto.CodMarca}</Text>
      </View>
    </ScrollView>
  );
};

// Estilos
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
  retryButton: {
    padding: 10,
    backgroundColor: '#FF8C00',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: screenHight * 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    zIndex: 2,
    top: 40,
    left: 10,
    elevation: 9,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.neutral.dark,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
    elevation: 5,
  },
  badgeText: {
    color: colors.primary.light,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stockBadge: {
    position: 'absolute',
    alignSelf: 'center',
    top: screenHight * 0.4 - 20, // Posicionado en la mitad entre la imagen y el siguiente div
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 3,
    elevation: 5,
  },
  stockBadgeText: {
    color: colors.neutral.dark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#999',
    fontSize: 20,
    fontWeight: 'bold',
  },
  productInfoContainer: {
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    padding: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default ProductScreen;
