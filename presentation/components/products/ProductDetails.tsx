import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import colors from '@/config/helpers/colors';

const ProductDetails = ({ producto, findMarcasById }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>{producto.Stock > 0 ? `${producto.Stock} Unidades` : 'Sin stock'}</Text>
        </View>
      <Text style={styles.title}>{producto.Producto}</Text>
      <Text style={styles.description}>{producto.Descripcion}</Text>
      <View style={styles.row}>
        <Text style={styles.detail}>{producto.Medida}</Text>
        <Text style={styles.brand}>{findMarcasById(producto.CodMarca)?.Marca || 'Desconocida'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.dark,
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary.light,
  },
  description: {
    fontSize: 16,
    color: colors.primary.dark,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    color: '#FFF',
  },
  brand: {
    fontSize: 16,
    color: colors.primary.light,
  },
  stockBadge: {
    position: 'absolute',
    alignSelf: 'center',
    top: -25,// Posicionado en la mitad entre la imagen y el siguiente div
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

});

export default ProductDetails;
