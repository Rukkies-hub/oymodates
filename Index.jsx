import React from 'react'
import { View, Text, Image } from 'react-native'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"

import Home from './screens/Home'
import Chat from './screens/Chat'

import colors from "./style/color"
import useAuth from "./hooks/useAuth"

const Index = () => {
  const Tab = createMaterialBottomTabNavigator()

  const { userProfile, loadingInitial, likes } = useAuth()
  
  return (
    <Tab.Navigator
      labeled={false}
      initialRouteName="Home"
      barStyle={{
        backgroundColor: colors.white,
        borderColor: colors.white,
        shadowOpacity: 0,
      }}

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") iconName = focused ? "view-carousel-outline" : "view-carousel-outline"
          if (route.name === "Chat") iconName = focused ? "chat" : "chat-outline"

          if (route.name === "Home" || route.name === "Feed" || route.name === "Likes" || route.name === "Chat") color = focused ? colors.black : colors.lightText

          if (route.name === "Home" || route.name === "Feed" || route.name === "Likes" || route.name === "Chat") size = focused ? 26 : 24

          return <MaterialCommunityIcons name={iconName} color={color} size={size} />
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />
    </Tab.Navigator>
  )
}

export default Index