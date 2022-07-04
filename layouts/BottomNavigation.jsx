import React, { useEffect } from 'react'
import { Image, SafeAreaView } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'

import * as NavigationBar from 'expo-navigation-bar'

import Match from '../screens/Match'
import Chat from '../screens/Chat'
import Feeds from '../screens/Feeds'
import Likes from '../screens/Likes'
import Reels from '../screens/Reels'

import colors from '../style/color'
import useAuth from '../hooks/useAuth'
import Bar from '../components/StatusBar'
import Header from '../components/Header'
import color from '../style/color'

const BottomNavigation = () => {
  const Tab = createMaterialBottomTabNavigator()
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
        barStyle={{
          backgroundColor: userProfile?.theme == 'dark' ? colors.black : color.white,
          height: 54,
          elevation: 0
        }}
      >
        <Tab.Screen
          name='Feeds'
          component={Feeds}
          options={{
            tabBarIcon: () => <Feather name='home' size={20} color={userProfile?.theme == 'dark' ? colors.white : color.black} />
          }}
        />

        <Tab.Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={userProfile?.theme == 'dark' ? colors.white : color.black} />
          }}
        />

        <Tab.Screen
          name='Reels'
          component={Reels}
          options={{
            tabBarIcon: () =>
              <Image
                source={userProfile?.appMode == 'dark' ? require('../assets/videoLight.png') : require('../assets/video.png')}
                style={{
                  width: 20,
                  height: 20
                }}
              />
          }}
        />

        {
          pendingSwipes?.length > 0 ?
            <Tab.Screen
              name='Likes'
              component={Likes}
              options={{
                tabBarBadge: pendingSwipes?.length,
                tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={userProfile?.appMode == 'dark' ? colors.white : colors.black} />
              }}
            /> :
            <Tab.Screen
              name='Likes'
              component={Likes}
              options={{
                tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={userProfile?.theme == 'dark' ? colors.white : colors.black} />
              }}
            />
        }
        <Tab.Screen
          name='Chat'
          component={Chat}
          options={{
            tabBarIcon: () => <Ionicons name='chatbubbles-outline' size={20} color={userProfile?.theme == 'dark' ? colors.white : colors.black} />
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default BottomNavigation