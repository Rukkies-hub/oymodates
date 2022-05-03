import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

import Home from './screens/Home'
import Chat from './screens/Chat'
import Login from './screens/Login'
import useAuth from './hooks/useAuth'

const StackNavigator = () => {
  const { user } = useAuth()

  return (
    <Stack.Navigator>
      {
        user ? (
          <>
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator