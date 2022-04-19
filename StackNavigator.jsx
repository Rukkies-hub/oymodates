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
import AccountSettings from './screens/AccountSettings'
import EditAbout from './screens/EditAbout'
import EditUsername from './screens/EditUsername'
import EditName from './screens/EditName'
import EditPassword from './screens/EditPassword'
import EditDateOfBirth from './screens/EditDateOfBirth'
import EditJob from './screens/EditJob'
import EditCompany from './screens/EditCompany'
import EditPassion from './screens/EditPassion'
import EditSchool from './screens/EditSchool'
import EditAddress from './screens/EditAddress'
import Match from './screens/Match'
import MessageScreen from './screens/MessageScreen'
import PreviewImage from './screens/PreviewImage'
import ViewProfile from './screens/ViewProfile'
import Account from './screens/Account'
import Setup from './screens/Setup'
import OymoPlus from './screens/OymoPlus'
import OymoGold from './screens/OymoGold'
import OymoPlatinum from './screens/OymoPlatinum'

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
            <Stack.Screen name="AccountSettings" component={AccountSettings} options={{ headerShown: false }} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: false }} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Match" component={Match} options={{ headerShown: false }} />
            <Stack.Screen name="PreviewImage" component={PreviewImage} options={{ headerShown: false }} />
            <Stack.Screen name="OymoPlus" component={OymoPlus} options={{ headerShown: false }} />
            <Stack.Screen name="OymoGold" component={OymoGold} options={{ headerShown: false }} />
            <Stack.Screen name="OymoPlatinum" component={OymoPlatinum} options={{ headerShown: false }} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="ViewProfile" component={ViewProfile} options={{ headerShown: false }} />
            <Stack.Screen name="Setup" component={Setup} options={{ headerShown: false }} />

            <Stack.Screen name="EditAbout" component={EditAbout} options={{ headerShown: false }} />
            <Stack.Screen name="EditUsername" component={EditUsername} options={{ headerShown: false }} />
            <Stack.Screen name="EditName" component={EditName} options={{ headerShown: false }} />
            <Stack.Screen name="EditPassion" component={EditPassion} options={{ headerShown: false }} />
            <Stack.Screen name="EditPassword" component={EditPassword} options={{ headerShown: false }} />
            <Stack.Screen name="EditDateOfBirth" component={EditDateOfBirth} options={{ headerShown: false }} />
            <Stack.Screen name="EditJob" component={EditJob} options={{ headerShown: false }} />
            <Stack.Screen name="EditCompany" component={EditCompany} options={{ headerShown: false }} />
            <Stack.Screen name="EditSchool" component={EditSchool} options={{ headerShown: false }} />
            <Stack.Screen name="EditAddress" component={EditAddress} options={{ headerShown: false }} />
          </Stack.Group>
        </>
      ) :
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
        </>
      }
    </Stack.Navigator>
  )
}

export default StackNavigator