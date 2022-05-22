import React, { useLayoutEffect } from 'react'
import { Image, SafeAreaView } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'

import * as NavigationBar from 'expo-navigation-bar'

import Match from './screens/Match'
import Chat from './screens/Chat'
import Feeds from './screens/Feeds'
import Likes from './screens/Likes'
import Reels from './screens/Reels'
import color from './style/color'
import useAuth from './hooks/useAuth'
import Header from './components/Header'
import Bar from './components/StatusBar'

const Index = () => {
  const { pendingSwipes } = useAuth()

  useLayoutEffect(() => {
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  }, [])
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar color={'dark'} />
      <Header showLogo showAratar showAdd />

      <Tab.Navigator
        initialRouteName='Feeds'
        screenOptions={{
          tabBarBounces: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 45,
            elevation: 0
          }
        }}
      >
        <Tab.Screen
          name="Feeds"
          component={Feeds}
          options={{
            tabBarIcon: () => (
              <Feather name='home' size={20} color={color.black} />
            )
          }}
        />

        <Tab.Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={color.black} />
            )
          }}
        />

        <Tab.Screen
          name='Reels'
          component={Reels}
          options={{
            tabBarIcon: () => (
              <Image
                source={require('./assets/video.png')}
                style={{
                  width: 20,
                  height: 20
                }}
              />
            )
          }}
        />

        <Tab.Screen
          name='Likes'
          component={Likes}
          options={{
            tabBarIcon: () => (
              <SimpleLineIcons name='like' size={20} color={color.black} />
            )
          }}
        />

        <Tab.Screen
          name='Chat'
          component={Chat}
          options={{
            tabBarIcon: () => (
              <Ionicons name='chatbubbles-outline' size={20} color={color.black} />
            )
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default Index