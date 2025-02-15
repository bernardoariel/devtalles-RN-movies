import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

import '../global.css'
import { PaperProvider } from 'react-native-paper'

const queryClient = new QueryClient()
const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </PaperProvider>
    </QueryClientProvider>
  )
}

export default RootLayout