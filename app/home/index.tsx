import { View, Text, ActivityIndicator, ScrollView,TouchableOpacity  } from 'react-native'
import React from 'react'
import { useMovies } from '@/presentation/hooks/useMovies'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MainSlideshow from '@/presentation/components/movies/MainSlideshow'
import MovieHorizontalList from '@/presentation/components/movies/MovieHorizontalList'
import { useRouter } from 'expo-router';
import SearchProduct from '@/presentation/components/products/SearchProduct'
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
       <SearchProduct />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;