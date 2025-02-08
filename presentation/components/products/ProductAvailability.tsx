import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductAvailability = ({ sucursales, findSucursalById }) => {
  return (
    <View style={styles.container}>
      {sucursales.map((sucursal) => {
        const sucursalData = findSucursalById(sucursal.CodSucursal);
        return (
          <View key={sucursal.CodSucursal} style={styles.sucursal}>
            <Text style={styles.text}>
              {sucursalData?.NombreSuc || 'Sucursal desconocida'} ({sucursal.Cantidad})
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sucursal: {
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 12,
    color: '#555',
  },
});

export default ProductAvailability;
