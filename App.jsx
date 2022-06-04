import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import StackNavigator from './StackNavigator'
import { AuthProvider } from './hooks/useAuth'

import { MenuProvider } from 'react-native-popup-menu'
import ReelsCommentSheet from './screens/modal/ReelsCommentSheet'

LogBox.ignoreAllLogs()

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212'
  },
}

export default function App () {
  return (
    <NavigationContainer theme={MyTheme}>
      <AuthProvider>
        <MenuProvider>
          <StackNavigator />
        </MenuProvider>
        <ReelsCommentSheet />
      </AuthProvider>
    </NavigationContainer>
  )
}
