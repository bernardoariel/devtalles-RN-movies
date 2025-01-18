import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct } from '../../presentation/hooks/useProducto';

import { LinearGradient } from 'expo-linear-gradient'; // Importamos LinearGradient
import { Ionicons } from '@expo/vector-icons'; // Importamos Ionicons para el ícono de volver
import { formatImageUrl } from '../../config/helpers/url.helper';

const screenHight = Dimensions.get('window').height;

const ProductScreen = () => {

  const router = useRouter(); // Hook para manejar la navegación
  const { id } = useLocalSearchParams(); // Obtén el parámetro dinámico
  const { producto, isLoading, isError } = useProduct({ id: Number(id) });
 
//203004
  

  const imageUrl = formatImageUrl(producto?.Imagen);
  console.log('producto::: ', imageUrl);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando producto...</Text>
        <ActivityIndicator color="purple" size="large" />
      </View>
    );
  }

   // Error al cargar producto
   if (isError || !producto) {
    return (
      <View style={styles.center}>
        <Text>Error al cargar el producto.</Text>
        <Pressable onPress={() => router.reload()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView>
      {/* Contenedor de la imagen con gradiente y botón */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover"/>
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>Sin imagen</Text>
                </View>
              )}
        
        {/* Gradiente */}
        <LinearGradient
          colors={['rgba(255,165,0,0.3)', 'transparent']}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: 'blue',
    marginTop: 10,
  },
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
  placeholder: {
    width: '100%', // Ocupa todo el ancho
    height: '100%', // Ocupa todo el alto
    justifyContent: 'center', // Centra el texto verticalmente
    alignItems: 'center', // Centra el texto horizontalmente
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#999',
    fontSize: 24, // Tamaño más grande para el texto
    fontWeight: 'bold', // Hace el texto más destacado
  },
});

export default ProductScreen;
