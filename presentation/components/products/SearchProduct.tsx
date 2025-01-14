import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const SearchProduct = () => {
  const [productId, setProductId] = useState(''); // Estado para el ID del producto
  const router = useRouter();

  const handleSearch = () => {
    const trimmedId = productId.trim(); // Eliminar espacios adicionales
    if (trimmedId && !isNaN(Number(trimmedId))) {
      router.push({
        pathname: `/product/[id]`,
        params: { id: trimmedId },
      });
    } else {
      alert('Por favor, ingrese un ID válido (número).');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Producto</Text>

      <TextInput
        style={styles.input}
        placeholder="ID del Producto"
        keyboardType="numeric"
        onChangeText={(text) => setProductId(text)}
        value={productId}
      />

      <Button title="Buscar Producto" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default SearchProduct;
