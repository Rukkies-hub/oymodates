import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigator from './layouts/StackNavigator'
import { AuthProvider } from './hooks/useAuth'

import { MenuProvider } from 'react-native-popup-menu'

import 'react-native-gesture-handler'
import color from './style/color'

import registerNNPushToken from 'native-notify'

import { appToken } from '@env'

LogBox.ignoreAllLogs()

export default function App () {
  registerNNPushToken(3167, appToken)

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
