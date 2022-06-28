import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import StackNavigator from './StackNavigator'
import { AuthProvider } from './hooks/useAuth'

import { MenuProvider } from 'react-native-popup-menu'

import 'react-native-gesture-handler'
import color from './style/color'

LogBox.ignoreAllLogs()

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: color.black,
  },
}

export default function App () {
  return (
    <NavigationContainer theme={MyTheme}>
      <AuthProvider>
        <MenuProvider>
          <StackNavigator />
        </MenuProvider>
      </AuthProvider>
    </NavigationContainer>
  )
}
