import React from 'react'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'

import Match from './screens/Match'
import Chat from './screens/Chat'
import Feeds from './screens/Feeds'
import Likes from './screens/Likes'

import colors from './style/color'
import useAuth from './hooks/useAuth'

const Index = () => {
  const Tab = createMaterialBottomTabNavigator()
  const { pendingSwipes } = useAuth()

  return (
    <Tab.Navigator
      initialRouteName='Feeds'
      barStyle={{
        backgroundColor: colors.white,
        borderColor: colors.white,
        borderWidth: 0,
        shadowOpacity: 0,
      }}
    >
      <Tab.Screen
        name='Feeds'
        component={Feeds}
        options={{
          tabBarIcon: () => (
            <Feather name='home' size={20} color={colors.black} />
          )
        }}
      />

      <Tab.Screen
        name='Match'
        component={Match}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={colors.black} />
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
                <SimpleLineIcons name='like' size={20} color={colors.black} />
              )
            }}
          /> :
          <Tab.Screen
            name='Likes'
            component={Likes}
            options={{
              tabBarIcon: () => (
                <SimpleLineIcons name='like' size={20} color={colors.black} />
              )
            }}
          />
      }
      <Tab.Screen
        name='Chat'
        component={Chat}
        options={{
          tabBarIcon: () => (
            <Ionicons name='chatbubbles-outline' size={20} color={colors.black} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default Index