import React from 'react'
import { ActivityIndicator, Image } from "react-native";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import HomeScreen from "./HomeScreen"
import Account from "./Account"

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
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="home" color={color} size={20} />
          ),
        }} />
      <Tab.Screen name="Account" component={Account}
        options={{
          headerShown: true,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            userProfile == null ?
              <ActivityIndicator size="small" color="rgba(0,0,0,0)" />
              : (userProfile.avatar ? <Image style={{ width: 30, height: 30, borderRadius: 50, marginTop: -3 }} source={{ uri: userProfile.avatar }} /> : <SimpleLineIcons name="user" color={color} size={22} />)
          ),
        }} />
    </Tab.Navigator>
  )
}