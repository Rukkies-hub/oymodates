import React from 'react'
import { Image } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import Match from './screens/Match'
import Chat from './screens/Chat'
import Feeds from './screens/Feeds'

import colors from './style/color'

const Index = () => {
  const Tab = createMaterialBottomTabNavigator()

  return (
    <Tab.Navigator
      labeled={false}
      initialRouteName='Match'
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
      <Tab.Screen name='Chat' component={Chat} />
    </Tab.Navigator>
  )
}

export default Index