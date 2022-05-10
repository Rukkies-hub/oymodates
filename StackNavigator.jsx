import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

import Index from './Index'
import Login from './screens/Login'
import Profile from './screens/Profile'
import NewMatch from './screens/modal/NewMatch'
import Message from './screens/Message'
import Add from './screens/Add'
import AddComment from './screens/modal/AddComment'
import DeviceGallery from './screens/modal/DeviceGallery'
import PostCamera from './screens/PostCamera'
import ViewPost from './screens/ViewPost'
import UserProfile from './screens/modal/UserProfile'
import Passion from './screens/modal/Passion'
import UserLocation from './screens/modal/UserLocation'

import useAuth from './hooks/useAuth'

const StackNavigator = () => {
  const { user } = useAuth()

  return (
    <Stack.Navigator>
      {
        user ? (
          <>
            <Stack.Group>
              <Stack.Screen name='Index' component={Index} options={{ headerShown: false }} />
              <Stack.Screen name='Message' component={Message} options={{ headerShown: false }} />
              <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
              <Stack.Screen name='Add' component={Add} options={{ headerShown: false }} />
              <Stack.Screen name='PostCamera' component={PostCamera} options={{ headerShown: false }} />
              <Stack.Screen name='ViewPost' component={ViewPost} options={{ headerShown: false }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
              <Stack.Screen name='NewMatch' component={NewMatch} options={{ headerShown: false }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name='AddComment' component={AddComment} options={{ headerShown: false }} />
              <Stack.Screen name='DeviceGallery' component={DeviceGallery} options={{ headerShown: false }} />
              <Stack.Screen name='UserProfile' component={UserProfile} options={{ headerShown: false }} />
              <Stack.Screen name='Passion' component={Passion} options={{ headerShown: false }} />
              <Stack.Screen name='UserLocation' component={UserLocation} options={{ headerShown: false }} />
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