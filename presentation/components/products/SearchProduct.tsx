import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { MarcasResponse } from '@/infrastructure/interfaces/marcas.interface';


const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filteredMarcas, setFilteredMarcas] = useState<MarcasResponse[]>([]); // Estado para marcas filtradas
  const router = useRouter();

  // Hook
  const { marcas } = useMarcas();

  // Filtrar marcas cuando el término de búsqueda cambia
  useEffect(() => {
    if (isNaN(Number(searchTerm)) && marcas) {
      const results = marcas.filter((marca) =>
        marca.Marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMarcas(results);
    } else {
      setFilteredMarcas([]);
    }
  }, [searchTerm, marcas]);

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm && !isNaN(Number(trimmedTerm))) {
      router.push({
        pathname: `/product/[id]`,
        params: { id: trimmedTerm },
      });
    }
  };

  const handleMarcaClick = (marca: MarcasResponse) => {
    console.log('Marca seleccionada:', marca);
    // Realiza cualquier acción adicional aquí
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Producto o Marca</Text>

      <TextInput
        style={styles.input}
        placeholder="ID del Producto o Nombre de Marca"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />

      <Button title="Buscar Producto" onPress={handleSearch} />

      {filteredMarcas.length > 0 && (
        <ScrollView style={styles.dropdown}>
          {filteredMarcas.map((item) => (
            <TouchableOpacity key={item.CodMarca} onPress={() => handleMarcaClick(item)}>
              <Text style={styles.listItem}>{item.Marca}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default SearchProduct;
