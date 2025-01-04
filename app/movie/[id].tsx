import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProduct } from '../../presentation/hooks/useProducto';

const ProductScreen = () => {
  const { id } = useLocalSearchParams();

  const { producto, isLoading, isError } = useProduct({ id: Number(203004) });
  console.log('producto::: ', producto.Imagen);

  // Función para corregir la URL
  const formatImageUrl = (url: string) => {
    if (!url) return '';
    return url.replace(':8080', ''); // Eliminamos el puerto :8080
  };

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
      {/* Encabezado del producto */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover" // Esto hace que la imagen ocupe todo el espacio y mantenga relación de aspecto
        />
      </View>
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
    height: 300, // Altura de la imagen
    backgroundColor: '#f0f0f0', // Color de fondo mientras se carga la imagen
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ProductScreen;
