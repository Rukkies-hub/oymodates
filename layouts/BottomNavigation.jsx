import React, { useEffect } from 'react'
import { Image, SafeAreaView } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons, Octicons } from '@expo/vector-icons'

import * as NavigationBar from 'expo-navigation-bar'

import Match from '../screens/Match'
import Chat from '../screens/Chat'
import LikesNavigation from '../screens/likes/LikesNavigation'
import Reels from '../screens/reels/Reels'
import Profile from '../screens/profile/Profile'

import useAuth from '../hooks/useAuth'
import Bar from '../components/StatusBar'
import Header from '../components/Header'
import color from '../style/color'

const BottomNavigation = () => {
  const Tab = createMaterialBottomTabNavigator()
  const { pendingSwipes, userProfile, user, theme } = useAuth()

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme == 'dark' ? color.black : color.white)
    NavigationBar.setButtonStyleAsync(theme == 'dark' ? 'light' : 'dark')
  }, [])

  NavigationBar.setBackgroundColorAsync(theme == 'dark' ? color.black : color.white)
  NavigationBar.setButtonStyleAsync(theme == 'dark' ? 'light' : 'dark')

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.transparent
      }}
    >
      <Bar color={theme == 'dark' ? 'light' : 'dark'} />

      <Header showLogo showAdd showNotification />

      <Tab.Navigator
        initialRouteName='Match'
        barStyle={{
          backgroundColor: theme == 'dark' ? color.black : color.white,
          height: 54,
          elevation: 0
        }}
      >
        <Tab.Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={theme == 'dark' ? color.white : color.black} />
          }}
        />

        {
          pendingSwipes?.length > 0 ?
            <Tab.Screen
              name='Likes'
              component={LikesNavigation}
              options={{
                tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={theme == 'dark' ? color.white : color.black} />,
                tabBarBadge: pendingSwipes?.length
              }}
            /> :
            <Tab.Screen
              name='Likes'
              component={LikesNavigation}
              options={{
                tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={theme == 'dark' ? color.white : color.black} />
              }}
            />
        }

        <Tab.Screen
          name='Reels'
          component={Reels}
          options={{
            tabBarIcon: () =>
              <Octicons name='video' size={24} color={theme == 'dark' ? color.white : color.black} />
          }}
        />

        <Tab.Screen
          name='Chat'
          component={Chat}
          options={{
            tabBarIcon: () => <Ionicons name='chatbubbles-outline' size={20} color={theme == 'dark' ? color.white : color.black} />
          }}
        />

        {
          !userProfile &&
          <Tab.Screen
            name='ProfileTab'
            component={Profile}
            listeners={({ navigation }) => ({
              tabPress: event => {
                event.preventDefault()
                navigation.navigate('EditProfile')
              }
            })}
            options={{
              tabBarIcon: () => <SimpleLineIcons name='user' size={20} color={theme == 'dark' ? color.white : color.dark} />,
              tabBarLabel: false
            }}
          />
        }

        {
          userProfile &&
          <Tab.Screen
            name='ProfileTab'
            component={Profile}
            listeners={({ navigation }) => ({
              tabPress: event => {
                event.preventDefault()
                navigation.navigate('Profile')
              }
            })}
            options={{
              tabBarIcon: () => (
                <>
                  {
                    userProfile?.photoURL &&
                    <Image
                      source={{ uri: userProfile?.photoURL }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50
                      }}
                    />
                  }
                  {
                    !userProfile?.photoURL &&
                    <SimpleLineIcons name='user' size={20} color={theme == 'dark' ? color.white : color.dark} />
                  }
                </>
              ),
              tabBarLabel: false
            }}
          />
        }
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default BottomNavigation
// in use