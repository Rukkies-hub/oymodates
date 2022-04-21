import React from 'react'
import { Image } from "react-native"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

const Tab = createMaterialBottomTabNavigator()

import HomeScreen from "./HomeScreen"
import ChatScreen from "./ChatScreen"

import useAuth from "../hooks/useAuth"
import Likes from './Likes'
import Account from "./Account"

import colors from '../style/color'

export default function Index () {
  const { userProfile, loadingInitial, likes } = useAuth()

  return (
    <Tab.Navigator
      labeled={false}
      initialRouteName="HomeScreen"
      barStyle={{
        backgroundColor: colors.white,
        borderColor: colors.white,
        shadowOpacity: 0,
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "HomeScreen")
            iconName = focused ? "home" : "home-outline"
          if (route.name === "Likes")
            iconName = focused ? "heart" : "heart-outline"
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
        }}
      />
      {
        likes.length ?
          (
            <Tab.Screen
              name="Likes"
              component={Likes}
              options={{
                headerShown: false,
                tabBarBadge: likes.length
              }}
            />
          ) :
          (
            <Tab.Screen
              name="Likes"
              component={Likes}
              options={{
                headerShown: false
              }}
            />
          )
      }
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Chat"
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
          tabBarLabel: "Account",
          tabBarIcon: ({ color, size }) => (
            <>
              {
                userProfile == null ?
                  <ActivityIndicator size="small" color="rgba(0,0,0,0)" />
                  : (userProfile?.avatar?.length ?
                    (
                      userProfile?.avatar &&
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 50,
                          marginTop: -3
                        }}
                        source={{ uri: userProfile?.avatar[0] }}
                      />
                    )
                    : <SimpleLineIcons name="user" color={colors.dark} size={22} />
                  )
              }
            </>
          )
        }}
      />
    </Tab.Navigator>
  )
}