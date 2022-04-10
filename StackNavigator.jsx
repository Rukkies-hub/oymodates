import { View, Text } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';

import Index from "./screens/Index"
import HomeScreen from "./screens/HomeScreen"
import ChatScreen from "./screens/ChatScreen"
import EditProfile from './screens/EditProfile'
import EditPersonalInformation from './screens/EditPersonalInformation'
import EditUsername from './screens/EditUsername'
import EditName from './screens/EditName'
import EditPassword from './screens/EditPassword'
import EditPhone from './screens/EditPhone'
import EditGender from './screens/EditGender'
import EditDateOfBirth from './screens/EditDateOfBirth'
import EditJob from './screens/EditJob'
import Match from './screens/Match'
import MessageScreen from './screens/MessageScreen'
import PreviewImage from './screens/PreviewImage'
import ViewProfile from './screens/ViewProfile'
import Account from './screens/Account'

import useAuth from "./hooks/useAuth"

const StackNavigator = () => {
  const { user } = useAuth()

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="EditPersonalInformation" component={EditPersonalInformation} options={{ headerShown: false }} />
            <Stack.Screen name="EditUsername" component={EditUsername} options={{ headerShown: false }} />
            <Stack.Screen name="EditName" component={EditName} options={{ headerShown: false }} />
            <Stack.Screen name="EditPassword" component={EditPassword} options={{ headerShown: false }} />
            <Stack.Screen name="EditPhone" component={EditPhone} options={{ headerShown: false }} />
            <Stack.Screen name="EditGender" component={EditGender} options={{ headerShown: false }} />
            <Stack.Screen name="EditDateOfBirth" component={EditDateOfBirth} options={{ headerShown: false }} />
            <Stack.Screen name="EditJob" component={EditJob} options={{ headerShown: false }} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: false }} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Match" component={Match} options={{ headerShown: false }} />
            <Stack.Screen name="PreviewImage" component={PreviewImage} options={{ headerShown: false }} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="ViewProfile" component={ViewProfile} options={{ headerShown: false }} />
          </Stack.Group>
        </>
      ) :
        <>
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        </>
      }
    </Stack.Navigator>
  )
}

export default StackNavigator