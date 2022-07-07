import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigator from './StackNavigator'
import { AuthProvider } from './hooks/useAuth'

import { MenuProvider } from 'react-native-popup-menu'

import 'react-native-gesture-handler'
import color from './style/color'

import registerNNPushToken from 'native-notify'

LogBox.ignoreAllLogs()

export default function App () {
  registerNNPushToken(3167, 'ND7GyrPMrqE6c0PdboxvGF')

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
