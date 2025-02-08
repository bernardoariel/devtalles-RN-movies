import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import colors from '@/config/helpers/colors';

const ProductDetails = ({ producto, findMarcasById }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>{producto.Stock > 0 ? `${producto.Stock} Unidades` : 'Sin stock'}</Text>
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productTitle}>{producto.Producto}</Text>
          <Text style={styles.productDescription}>{producto.Descripcion}</Text>
          <View style={styles.rowContainer}>
            <Text style={[styles.detail, styles.whiteText]}>{producto.Medida}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {findMarcasById(producto.CodMarca)?.Marca || 'Desconocida'}
              </Text>
            </View>
          </View>
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
  productInfoContainer: {
    backgroundColor: colors.neutral.dark, // Asegúrate de que el contenedor tenga un fondo
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 24, // Redondear el borde inferior izquierdo
    borderBottomRightRadius: 24, // Redondear el borde inferior derecho
    overflow: 'hidden', // Garantiza que el contenido respete los bordes redondeados
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
    color: colors.primary.light,
  },
  productDescription: {
    fontSize: 16,
    color: colors.primary.dark,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Asegura que ocupe todo el ancho del contenedor
    paddingHorizontal: 16, // Opcional: añade espacio a los lados
    paddingTop:5,
  },
  whiteText: {
    backgroundColor: colors.neutral.dark,
    color: '#fff', // Texto blanco
    paddingHorizontal: 10, // Espaciado horizontal
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 12,
  },
  
  badgeContainer: {
    backgroundColor: colors.primary.main, // Fondo del badge
    paddingHorizontal: 10, // Espaciado horizontal
    paddingVertical: 4, // Espaciado vertical
    borderRadius: 12, // Bordes redondeados
    alignItems: 'center', // Centrar el texto
  },

});

export default ProductDetails;
