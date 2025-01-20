import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token; // Devuelve true si hay un token, false si no
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return false;
  }
};
