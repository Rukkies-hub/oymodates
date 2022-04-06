import React from 'react'
import { ActivityIndicator, Image } from "react-native";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import HomeScreen from "./HomeScreen"
import Feed from "./Feed"
import Activity from "./Activity"
import Account from "./Account"

import useAuth from "../hooks/useAuth"

const EmptyScreen = () => {
  return null
}

export default function Index () {
  const { userProfile, loadingInitial } = useAuth()

  return (
    <Tab.Navigator
      labeled={false}
      initialRouteName="Feed"
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
          else if (route.name === "Feed")
            iconName = focused ? "home" : "home-outline"
          else if (route.name === "Activity")
            iconName = focused ? "heart" : "heart-outline"


          return <MaterialCommunityIcons name={iconName} color={color} size={26} />
        }
      })}
    >
      <Tab.Screen name="Feed" component={Feed}
        options={{
          headerShown: true,
          tabBarLabel: "Search"
        }} />
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: true,
        }} />
      <Tab.Screen name="EmptyScreen" component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault()
            navigation.navigate("Add")
          }
        })}
        options={{
          headerShown: false,
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="feather" color={color} size={22} />
          ),
        }} />
      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          headerShown: true,
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