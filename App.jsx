import * as React from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import StackNavigator from './layout/StackNavigator'
import { AuthProvider } from './hooks/useAuth'

export default function App () {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  )
}
