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
       onPress={() => onResultClick(item.CodProducto || item.Marca)}
     >
       <View style={styles.row}>
         {item.Producto ? (
           <>
             <Text style={styles.description}>{item.Producto}</Text>
             <View style={styles.badgeContainer}>
               <Text style={styles.badgeText}>{item.CodProducto}</Text>
             </View>
           </>
         ) : (
           <>
             <Text style={[styles.description, { flex: 7 }]}>{item.Marca}</Text>
             <View style={styles.badgeContainer}>
               <Text style={styles.badgeText}>X Marca</Text>
             </View>
           </>
         )}
       </View>
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
  resultRow: {
    flexDirection: 'row', // Alinear horizontalmente
    alignItems: 'center', // Centrar verticalmente
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.main,
  },
  resultText: {
    color: colors.primary.dark,
  },
  badge: {
    backgroundColor: colors.primary.dark, // Fondo del badge
    borderRadius: 12, // Redondear bordes
    paddingHorizontal: 8, // Espaciado lateral
    paddingVertical: 2, // Espaciado vertical
    alignSelf: 'flex-start', // Ajusta el tamaño al contenido
    marginLeft: 8, // Separación con el texto del producto
    
  },
  badgeText: {
    color: colors.neutral.dark,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row', // Alinear en fila
    alignItems: 'flex-start', // Alinear los elementos en la parte superior para soportar múltiples filas
    justifyContent: 'space-between', // Espaciado entre descripción y badge
  },
  description: {
    flex: 7, // Ocupa el 70% del ancho
    color: colors.neutral.dark,
    fontSize: 14, // Ajusta el tamaño del texto si es necesario
    marginRight: 8, // Espacio entre descripción y badge
  },
  badgeContainer: {
    flex: 3, // Ocupa el 30% del ancho
    backgroundColor: colors.primary.dark,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
});

export default ResultsList;
