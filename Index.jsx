import React from 'react'
import { Image, SafeAreaView } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'

import Match from './screens/Match'
import Chat from './screens/Chat'
import Feeds from './screens/Feeds'
import Likes from './screens/Likes'
import Reels from './screens/Reels'

import colors from './style/color'
import useAuth from './hooks/useAuth'
import Bar from './components/StatusBar'
import Header from './components/Header'
import color from './style/color'

const Index = () => {
  const Tab = createMaterialBottomTabNavigator()
  const { pendingSwipes, userProfile } = useAuth()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode != 'light' ? color.white : color.dark
      }}
    >
      <Bar color={userProfile?.appMode != 'light' ? 'dark' : 'light'} />
      <Header showLogo showAdd showAratar />
      <Tab.Navigator
        initialRouteName='Feeds'
        barStyle={{
          backgroundColor: userProfile?.appMode != 'light' ? colors.white : color.dark,
          height: 54,
          elevation: 0
        }}
      >
        <Tab.Screen
          name='Feeds'
          component={Feeds}
          options={{
            tabBarIcon: () => (
              <Feather name='home' size={20} color={userProfile?.appMode != 'light' ? colors.black : color.white} />
            )
          }}
        />

        <Tab.Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={userProfile?.appMode != 'light' ? colors.black : color.white} />
            )
          }}
        />

        <Tab.Screen
          name='Reels'
          component={Reels}
          options={{
            tabBarIcon: () => (
              <Image
                source={userProfile?.appMode != 'light' ? require('./assets/video.png') : require('./assets/videoLight.png')}
                style={{
                  width: 20,
                  height: 20
                }}
              />
            )
          }}
        />

        {
          pendingSwipes?.length > 0 ?
            <Tab.Screen
              name='Likes'
              component={Likes}
              options={{
                tabBarBadge: pendingSwipes?.length,
                tabBarIcon: () => (
                  <SimpleLineIcons name='like' size={20} color={userProfile?.appMode != 'light' ? colors.black : colors.white} />
                )
              }}
            /> :
            <Tab.Screen
              name='Likes'
              component={Likes}
              options={{
                tabBarIcon: () => (
                  <SimpleLineIcons name='like' size={20} color={userProfile?.appMode != 'light' ? colors.black : colors.white} />
                )
              }}
            />
        }
        <Tab.Screen
          name='Chat'
          component={Chat}
          options={{
            tabBarIcon: () => (
              <Ionicons name='chatbubbles-outline' size={20} color={userProfile?.appMode != 'light' ? colors.black : colors.white} />
            )
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default Index