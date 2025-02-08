import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/config/helpers/colors';

const ProductDetails = ({ producto, findMarcasById }) => {
  return (
    <View style={styles.container}>
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
});

export default ProductDetails;
