import colors from '@/config/helpers/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { View, Pressable, Image, StyleSheet, Text, Dimensions } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

interface ProductImageViewerProps {
  imageUrl: string; // La URL de la imagen es un string
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({ imageUrl }) => {

  const [isImageVisible, setImageVisible] = useState(false);

  return (
    <View style={[styles.container, !imageUrl && styles.containerPlaceholder]}>

  {imageUrl ? (
    <Pressable onPress={() => setImageVisible(true)} style={styles.imagePressable}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={[colors.primary.light, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    </Pressable>
  ) : (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Sin imagen</Text>
    </View>
  )}

  <ImageViewing
    images={[{ uri: imageUrl }]}
    imageIndex={0}
    visible={isImageVisible}
    onRequestClose={() => setImageVisible(false)}
  />
</View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: screenHeight * 0.4, // Ajuste dinámico según el tamaño de pantalla
     overflow: 'hidden'
  },
  imagePressable: {
    width: '100%',
    height: '100%', // Ocupa todo el contenedor
  },
  image: {
    width: screenWidth, // Ajusta a la pantalla completa en ancho
    height: '100%', // Asegura que la imagen ocupa toda la altura del contenedor
    borderRadius: 10,
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
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '10%', // Ocupa solo el 30% superior
    top: 0, // Lo pega arriba
    zIndex: 1,
  },containerPlaceholder: {
    height: 100, // O el tamaño que quieras
  },
  
  
});

export default ProductImageViewer;
