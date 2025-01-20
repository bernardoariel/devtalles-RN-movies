import { abrilApi } from '@/app/core/api/movie-api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const login = async (email: string, password: string) => {
  try {
    const response = await abrilApi.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data;

    // Guardar los tokens en AsyncStorage
    await AsyncStorage.setItem('authToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error: error.response?.data || 'Error desconocido' };
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No hay refresh token disponible');

    const response = await abrilApi.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data;

    // Guardar el nuevo access token
    await AsyncStorage.setItem('authToken', accessToken);

    return { success: true, accessToken };
  } catch (error: any) {
    console.error('Error al refrescar el token:', error);
    return { success: false, error: error.response?.data || 'Error desconocido' };
  }
};
