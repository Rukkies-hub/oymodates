import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigator from './StackNavigator'
import { AuthProvider } from './hooks/useAuth'

import { MenuProvider } from 'react-native-popup-menu'

LogBox.ignoreAllLogs()

export default function App () {
  return (
    <NavigationContainer>
      <AuthProvider>
        <MenuProvider>
          <StackNavigator />
        </MenuProvider>
      </AuthProvider>
    </NavigationContainer>
  )
}
