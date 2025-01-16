import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProductCardProps {
  codProducto: string;
  nombreProducto: string;
  medida: string;
  descripcion: string;
  precio: number;
  stock: number;
  imageUrl: string | null; // Cambiar para recibir imageUrl directamente
}

const ProductCard: React.FC<ProductCardProps> = ({
  codProducto,
  nombreProducto,
  medida,
  descripcion,
  precio,
  stock,
  imageUrl,
}) => {
  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{nombreProducto}</Text>
        <Text style={styles.text}>Código: {codProducto}</Text>
        <Text style={styles.text}>Medida: {medida}</Text>
        <Text style={styles.text}>Descripción: {descripcion}</Text>
        <Text style={styles.text}>Precio: ${precio.toFixed(2)}</Text>
        <Text style={styles.text}>Stock: {stock} unidades</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
});

export default ProductCard;
