import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/infrastructure/hooks/useAuth'; // Hook para verificar autenticación
import colors from '@/config/helpers/colors';

const Index = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Verificar si el usuario está autenticado
      const isAuthenticated = await useAuth();

      // Redirigir según el estado de autenticación
      if (isAuthenticated) {
        router.replace('/home'); // Usuario autenticado
      } else {
        router.replace('/login'); // Usuario no autenticado
      }

      setIsLoading(false); // Finaliza el estado de carga
    };

    checkAuth();
  }, []);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return null; // No se renderiza nada mientras redirige
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.light,
  },
});

export default Index;
