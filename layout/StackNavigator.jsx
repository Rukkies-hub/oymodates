import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login'
import Feed from '../screens/Feed'
import useAuth from '../hooks/useAuth'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
  const { user } = useAuth()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {
        user ? (
          <Stack.Screen name='Feed' component={Feed} />
        ) : (
          <Stack.Screen name='Login' component={Login} />
        )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator