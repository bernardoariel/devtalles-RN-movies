import { View, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import SearchProduct from '@/presentation/components/products/SearchProduct';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <>
      {/* Cambia el estilo de la barra de estado */}
      <StatusBar backgroundColor="#FCB800" barStyle="light-content" />

      <View style={styles.container}>
        {/* Contenedor fijo con bordes redondeados */}
        <View style={styles.header}>
          <SearchProduct />
        </View>
        {/* Otros contenidos */}
        <View style={styles.content}>
          {/* Coloca aquí el contenido que deseas */}
        </View>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FCB800',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1, // Asegura que SearchProduct esté por encima
  },
  content: {
    flex: 1,
    marginTop: -16, // Ajusta la posición si el desplegable cubre demasiado
    backgroundColor: '#252525',
  },
});
