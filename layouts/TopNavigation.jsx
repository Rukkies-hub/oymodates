import React, { useEffect } from 'react'
import { Image, SafeAreaView } from 'react-native'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'

import * as NavigationBar from 'expo-navigation-bar'

import Match from '../screens/Match'
import Chat from '../screens/Chat'
import Feeds from '../screens/Feeds'
import Likes from '../screens/Likes'
import Reels from '../screens/Reels'

import useAuth from '../hooks/useAuth'
import Bar from '../components/StatusBar'
import Header from '../components/Header'
import color from '../style/color'

const TopNavigation = () => {
  const Tab = createMaterialTopTabNavigator()

  const { pendingSwipes, userProfile } = useAuth()

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(userProfile?.theme == 'dark' ? color.black : color.white)
    NavigationBar.setButtonStyleAsync(userProfile?.theme == 'dark' ? 'light' : 'dark')
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

      <Header showLogo showAdd showAratar showNotification />

      <Tab.Navigator
        initialRouteName='Feeds'
        keyboardDismissMode='auto'
        screenOptions={{
          tabBarShowLabel: false,
          lazy: true,
          tabBarStyle: {
            backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
            height: 50,
            elevation: 0
          }
        }}
      >
        <Tab.Screen
          name='Feeds'
          component={Feeds}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name='grid' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
          }}
        />

        <Tab.Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />,
            swipeEnabled: false
          }}
        />

        <Tab.Screen
          name='Reels'
          component={Reels}
          options={{
            tabBarIcon: () =>
              <Image
                source={userProfile?.theme == 'dark' ? require('../assets/videoLight.png') : require('../assets/video.png')}
                style={{
                  width: 20,
                  height: 20
                }}
              />,
            swipeEnabled: false
          }}
        />

        {
          pendingSwipes?.length > 0 ?
            <Tab.Screen
              name='Likes'
              component={Likes}
              options={{
                tabBarBadge: pendingSwipes?.length,
                tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
              }}
            /> :
            <Tab.Screen
              name='Likes'
              component={Likes}
              options={{
                tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
              }}
            />
        }
        <Tab.Screen
          name='Chat'
          component={Chat}
          options={{
            tabBarIcon: () => <Ionicons name='chatbubbles-outline' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default TopNavigation