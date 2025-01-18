import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import colors from '@/config/helpers/colors';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';

interface ResultsListProps {
  results: ProductsResponse[];
  onResultClick: (id: string) => void; // Función para manejar clic en un resultado
}

const ResultsList: React.FC<ResultsListProps> = ({ results, onResultClick }) => {
  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require('@/assets/images/logo.png')} // Asegúrate de que la ruta sea correcta
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <Text style={styles.emptyText}>No hay resultados</Text> */}
      </View>
    );
  }

  return (
    <View style={styles.resultsWrapper}>
      <ScrollView
        style={styles.resultsContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {results.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.resultItem}
            onPress={() => onResultClick(item.CodProducto || item.Marca)} // Navega con el ID del producto
          >
            <Text style={styles.resultText}>
              {item.Producto ? `${item.Producto} - ${item.CodProducto}` : item.Marca}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.primary.dark,
    textAlign: 'center',
  },
  resultsWrapper: {
    position: 'absolute',
    top: 125, // Justo debajo del input
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  resultsContainer: {
    maxHeight: 800,
    borderRadius: 5,
    padding: 8,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.main,
  },
  resultText: {
    color: colors.primary.dark,
  },
});

export default ResultsList;
