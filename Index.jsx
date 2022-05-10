import React from 'react'
import { Image } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

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

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let imageName

          if (route.name === 'Feeds') imageName = focused ? require('./assets/home-fill.png') : require('./assets/home-outline.png')
          if (route.name === 'Match') imageName = focused ? require('./assets/tinder-fill.png') : require('./assets/tinder-outline.png')
          if (route.name === 'Likes') imageName = focused ? require('./assets/diamonds-fill.png') : require('./assets/diamonds-outline.png')
          if (route.name === 'Chat') imageName = focused ? require('./assets/chat-fill.png') : require('./assets/chat-outline.png')

          return (
            <Image
              source={imageName}
              style={{
                width: 25,
                height: 25
              }}
            />
          )
        }
      })}
    >
      <Tab.Screen name='Feeds' component={Feeds} />
      <Tab.Screen name='Match' component={Match} />
      <Tab.Screen
        name='Likes'
        component={Likes}
        options={{
          tabBarBadge: pendingSwipes?.length
        }}
      />
      <Tab.Screen name='Chat' component={Chat} />
    </Tab.Navigator>
  )
}

export default Index