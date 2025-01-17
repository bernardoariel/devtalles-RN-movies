import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import colors from "@/config/helpers/colors";

const ResultsList = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <View style={styles.resultsWrapper}>
      <ScrollView
        style={styles.resultsContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {results.map((item, index) => (
          <TouchableOpacity key={index} style={styles.resultItem}>
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
  resultsWrapper: {
    position: "absolute",
    top: 70, // Justo debajo del input
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  resultsContainer: {
    maxHeight: 250,
    borderWidth: 1,
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
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
