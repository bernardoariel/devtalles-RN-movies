import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/infrastructure/hooks/useAuth';
import colors from '@/config/helpers/colors';

const AuthCheckScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await useAuth();

      if (isAuthenticated) {
        router.replace('/home'); // Redirige a /home si está autenticado
      } else {
        router.replace('/login'); // Redirige a /login si no está autenticado
      }

      setIsLoading(false); // Deja de cargar
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return null; // No renderiza nada mientras redirige
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.light,
  },
});

export default AuthCheckScreen;
