import React from 'react'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import Home from './screens/Home'
import Chat from './screens/Chat'
import Feeds from './screens/Feeds'

import colors from './style/color'

const Index = () => {
  const Tab = createMaterialBottomTabNavigator()
  
  return (
    <Tab.Navigator
      labeled={false}
      initialRouteName='Feeds'
      barStyle={{
        backgroundColor: colors.white,
        borderColor: colors.white,
        shadowOpacity: 0,
      }}

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Feeds') iconName = focused ? 'feather' : 'feather'
          if (route.name === 'Home') iconName = focused ? 'kiss-wink-heart' : 'kiss-wink-heart'
          if (route.name === 'Chat') iconName = focused ? 'rocketchat' : 'comment'

          if (route.name === 'Home' || route.name === 'Feeds' || route.name === 'Likes' || route.name === 'Chat') color = focused ? colors.blue : colors.lightText

          return <FontAwesome5 name={iconName} color={color} size={20} />
        }
      })}
    >
      <Tab.Screen name='Feeds' component={Feeds} />
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Chat' component={Chat} />
    </Tab.Navigator>
  )
}

export default Index