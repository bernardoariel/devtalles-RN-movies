import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct } from '../../presentation/hooks/useProducto';

import { LinearGradient } from 'expo-linear-gradient'; // Importamos LinearGradient
import { Ionicons } from '@expo/vector-icons'; // Importamos Ionicons para el ícono de volver
import { formatImageUrl } from '../../config/helpers/url.helper';
import colors from '@/config/helpers/colors';

const screenHight = Dimensions.get('window').height;

const ProductScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter(); // Hook para manejar la navegación

  const { producto, isLoading, isError } = useProduct({ id: Number(203004) });


  const imageUrl = formatImageUrl(producto?.Imagen);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando producto...</Text>
        <ActivityIndicator color="purple" size="large" />
      </View>
    );
  }

  if (isError || !producto) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error al cargar el producto.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {/* Contenedor de la imagen con gradiente y botón */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Gradiente */}
        <LinearGradient
          colors={[colors.primary.main, 'transparent']}
          start={{ x: 0, y: 0 }} // Esquina superior izquierda
          end={{ x: 0.5, y: 0.5 }} // Se desvanece hacia el primer cuarto
          style={styles.gradient}
        />
        {/* Botón de volver */}
        <View style={styles.backButton}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="orange" />
          </Pressable>
        </View>
      </View>

      {/* Información del producto */}
      <View style={{ alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 8 }}>
          {producto.Producto}
        </Text>
        <Text style={{ fontSize: 18, color: 'gray' }}>{producto.Descripcion}</Text>
      </View>

      {/* Detalles del producto */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Detalles:</Text>
        <Text>Precio: ${producto.Precio}</Text>
        <Text>Stock: {producto.Stock}</Text>
        <Text>Medida: {producto.Medida}</Text>
        <Text>Categoría: {producto.CodCategoria}</Text>
        <Text>Marca: {producto.CodMarca}</Text>
      </View>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: screenHight * 0.4, // Altura del contenedor de la imagen
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
});

export default ProductScreen;
