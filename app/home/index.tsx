import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React from 'react'
import { useMovies } from '@/presentation/hooks/useMovies'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MainSlideshow from '@/presentation/components/movies/MainSlideshow'
import MovieHorizontalList from '@/presentation/components/movies/MovieHorizontalList'

const HomeScreen = () => {

  const safeArea = useSafeAreaInsets()
  const { nowPlayingQuery ,popularQuery, upcomingQuery,topRatedQueryQuery } = useMovies()

  if (nowPlayingQuery.isLoading){
    return(
      <View className='justify-center items-center flex-1'>
        <ActivityIndicator color='purple' size={40}/>
      </View>
    )
  }

  return (
    <ScrollView>
    <View className='mt-2 pb-10' style={{paddingTop:safeArea.top}}>
      <Text className='text-3xl font-bold px-4 mb-2'>HomeScreen</Text>
      <MainSlideshow movies={nowPlayingQuery.data ?? []} />

      <MovieHorizontalList
      title='Populares'
      movies={popularQuery.data ?? []}
      className='mb-5'
       />
      <MovieHorizontalList
      title='Mejor Calificadas'
      movies={topRatedQueryQuery.data?.pages.flat() ?? []}
      className='mb-5'
      loadNextPage={topRatedQueryQuery.fetchNextPage}
       />
      <MovieHorizontalList
      title='Proximamente'
      movies={upcomingQuery.data ?? []}
      className='mb-5'
       />
      <MovieHorizontalList
      movies={upcomingQuery.data ?? []}
      className='mb-5'
       />
    </View>
    </ScrollView>
  )
}

export default HomeScreen