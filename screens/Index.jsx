import React from 'react'
import { ActivityIndicator, Image } from "react-native";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import HomeScreen from "./HomeScreen"
import ChatScreen from "./ChatScreen"

import useAuth from "../hooks/useAuth"
import Likes from './Likes'

import colors from '../style/color';

export default function Index () {
  const { userProfile, loadingInitial } = useAuth()

  return (
    <Tab.Navigator
      labeled={false}
      initialRouteName="HomeScreen"
      barStyle={{
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        shadowOpacity: 0,
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "HomeScreen")
            iconName = focused ? "home" : "home-outline"
          if (route.name === "Likes")
            iconName = focused ? "account-heart" : "account-heart-outline"
          if (route.name === "Chat")
            iconName = focused ? "chat" : "chat-outline"

          if (route.name === "HomeScreen")
            color = focused ? colors.red : colors.lightText
          if (route.name === "Likes")
            color = focused ? colors.red : colors.lightText
          if (route.name === "Chat")
            color = focused ? colors.red : colors.lightText
          
          if (route.name === "HomeScreen")
            size = focused ? 26 : 24
          if (route.name === "Likes")
            size = focused ? 26 : 24
          if (route.name === "Chat")
            size = focused ? 26 : 24

          return <MaterialCommunityIcons name={iconName} color={color} size={size} />
        }
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }} />
      <Tab.Screen
        name="Likes"
        component={Likes}
        options={{
          headerShown: false,
        }} />
      <Tab.Screen name="Chat" component={ChatScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Chat"
        }} />
    </Tab.Navigator>
  )
}