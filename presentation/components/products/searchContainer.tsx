import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProducts } from "@/presentation/hooks/useProducts";
import { useMarcas } from "@/presentation/hooks/useMarcas";
import colors from "@/config/helpers/colors";

import { Portal } from "react-native-paper"; // Importamos Portal
import ResultsList from "./SearchProduct";

const SearchContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const { productos } = useProducts();
  const { marcas } = useMarcas();

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      const filteredProductos = productos.filter((producto) =>
        producto.Producto?.toLowerCase().includes(term)
      );

      const filteredMarcas = marcas?.filter((marca) =>
        marca.Marca?.toLowerCase().includes(term)
      );

      setFilteredResults([...filteredProductos, ...(filteredMarcas || [])]);
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm, productos, marcas]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.primary.dark} />
            <TextInput
              style={styles.input}
              placeholder="Buscar..."
              placeholderTextColor={colors.primary.dark}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Renderizamos los resultados en un Portal */}
        <Portal>
          <ResultsList results={filteredResults} />
        </Portal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary.main,
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: colors.primary.light,
  },
  input: {
    flex: 1,
    padding: 10,
    color: colors.primary.dark,
  },
});

export default SearchContainer;
