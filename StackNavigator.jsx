import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

import Index from "./Index"
import Login from './screens/Login'
import UpdateModal from './screens/modal/UpdateModal'
import Match from './screens/modal/Match'

import useAuth from './hooks/useAuth'

const StackNavigator = () => {
  const { user } = useAuth()

  return (
    <Stack.Navigator>
      {
        user ? (
          <>
            <Stack.Group>
              <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="UpdateModal" component={UpdateModal} options={{ headerShown: false }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
              <Stack.Screen name="Match" component={Match} options={{ headerShown: false }} />
            </Stack.Group>
          </>
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator