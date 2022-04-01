import React from 'react'
import { ActivityIndicator, Image } from "react-native";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import HomeScreen from "./HomeScreen"
import Add from "./Add"
import Discover from "./Discover"
import Activity from "./Activity"
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
      }}>
      <Tab.Screen name="HomeScreen" component={HomeScreen}
        options={{
          headerShown: true,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="home" color={color} size={22} />
          ),
        }} />
      <Tab.Screen name="Discover" component={Discover}
        options={{
          headerShown: true,
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="magnifier" color={color} size={22} />
          ),
        }} />
      <Tab.Screen name="Add" component={Add}
        options={{
          headerShown: true,
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="social-youtube" color={color} size={22} />
          ),
        }} />
      <Tab.Screen name="Activity" component={Activity}
        options={{
          headerShown: true,
          tabBarLabel: "Activity",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="heart" color={color} size={22} />
          ),
        }} />
      <Tab.Screen name="Account" component={Account}
        options={{
          headerShown: true,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            userProfile == null ?
              <ActivityIndicator size="small" color="#0000ff" />
              : (userProfile.avatar ? <Image style={{ width: 30, height: 30, borderRadius: 50, marginTop: -3 }} source={{ uri: userProfile.avatar }} /> : <SimpleLineIcons name="user" color={color} size={22} />)
          ),
        }} />
    </Tab.Navigator>
  )
}