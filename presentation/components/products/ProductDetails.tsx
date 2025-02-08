import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import colors from '@/config/helpers/colors';
import { Producto } from '@/infrastructure/interfaces/producto.interface';

interface ProductDetailsProps {
  producto: Producto;
  findMarcasById: (id: number) => { Marca?: string } | undefined;
}
const ProductDetails: React.FC<ProductDetailsProps> = ({ producto, findMarcasById }) => {
  return (
    <View>
      <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>{producto.Stock > 0 ? `${producto.Stock} Unidades` : 'Sin stock'}</Text>
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productTitle}>{producto.Producto}</Text>
          <Text style={styles.productDescription}>{producto.Descripcion}</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.whiteText}>{producto.Medida}</Text>
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
    justifyContent: 'center',
    width: '100%', // Asegura que ocupe todo el ancho del contenedor
    paddingHorizontal: 16, // Opcional: añade espacio a los lados
    paddingTop:5,
    alignItems: 'center', // Centra verticalmente
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
    marginLeft:5
  },
  badgeText: {
    color: colors.primary.light,
    fontSize: 14,
    fontWeight: 'bold',
  },

});

export default ProductDetails;
