import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import StackNavigator from './StackNavigator'
import DrawerNavigator from './DrawerNavigator'
import { AuthProvider } from './hooks/useAuth'

import { MenuProvider } from 'react-native-popup-menu'

import 'react-native-gesture-handler'

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
