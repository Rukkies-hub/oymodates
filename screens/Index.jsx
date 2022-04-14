import React from 'react'
import { ActivityIndicator, Image } from "react-native";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import HomeScreen from "./HomeScreen"
import ChatScreen from "./ChatScreen"

import useAuth from "../hooks/useAuth"

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
            iconName = focused ? "magnify" : "magnify"
          if (route.name === "Chat")
            iconName = focused ? "chat" : "chat-outline"

          return <MaterialCommunityIcons name={iconName} color={color} size={26} />
        }
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: true,
        }} />
      <Tab.Screen name="Chat" component={ChatScreen}
        options={{
          headerShown: true,
          tabBarLabel: "Chat"
        }} />
    </Tab.Navigator>
  )
}