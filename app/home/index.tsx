import { View, StatusBar, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import SearchProduct from '@/presentation/components/products/SearchProduct';
import colors from '@/config/helpers/colors';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <>
    {/* Cambia el estilo de la barra de estado */}
    <StatusBar backgroundColor={colors.primary.main} barStyle="light-content" />

    <View style={styles.container}>
      {/* Contenedor fijo con bordes redondeados */}
      <View style={styles.header}>
        <SearchProduct />
      </View>
      {/* Otros contenidos */}
      <View style={styles.content}>
        {/* Coloca aquí el contenido que deseas */}
        <Image
          source={require('@/assets/images/logo.png')} // Ruta del logo
          style={styles.logo}
        />
      </View>
    </View>
  </>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.light, // Usamos color global
  },
  header: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
    overflow: 'visible', // Asegura que el dropdown se renderice fuera del contenedor
  },
  content: {
    flex: 1, // Asegura que ocupe todo el espacio disponible
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    backgroundColor: colors.primary.light, // Naranja suave
  },
  logo: {
    width: 200, // Ajusta el tamaño del logo según tus necesidades
    height: 200,
    resizeMode: 'contain', // Mantiene las proporciones del logo
  },
});