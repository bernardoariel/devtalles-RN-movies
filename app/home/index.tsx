import { View, Text, ActivityIndicator, ScrollView,TouchableOpacity  } from 'react-native'
import React from 'react'
import { useMovies } from '@/presentation/hooks/useMovies'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MainSlideshow from '@/presentation/components/movies/MainSlideshow'
import MovieHorizontalList from '@/presentation/components/movies/MovieHorizontalList'
import { useRouter } from 'expo-router';
const HomeScreen = () => {
  const router = useRouter();

  const productos = [
    { id: 1, name: 'Producto 1' },
    { id: 2, name: 'Producto 2' },
    { id: 3, name: 'Producto 3' },
  ]; // Datos de ejemplo

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Lista de Productos</Text>
        {productos.map((producto) => (
          <TouchableOpacity
            key={producto.id}
            onPress={() => router.push(`/movie/${producto.id}`)} // Navegar al componente dinámico
            style={{
              padding: 16,
              marginBottom: 8,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>{producto.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;