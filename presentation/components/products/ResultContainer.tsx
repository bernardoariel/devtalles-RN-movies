import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ProductsResponse } from '@/infrastructure/interfaces/productos.interface';

interface ResultContainerProps {
  results: ProductsResponse[]; // Resultados filtrados
  onResultClick: (result: ProductsResponse) => void; // Acción al seleccionar un resultado
}

const ResultContainer: React.FC<ResultContainerProps> = ({ results, onResultClick }) => {
  return (
    <ScrollView style={styles.container}>
      {results.map((result, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => onResultClick(result)} // Llama a la acción al hacer clic
        >
          <Text style={styles.text}>{result.Producto || result.Marca}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default ResultContainer;
