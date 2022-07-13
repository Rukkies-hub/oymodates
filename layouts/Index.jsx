import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import AllAdd from '../screens/AllAdd'
import BottomNavigation from './BottomNavigation'
import TopNavigation from './TopNavigation'
import useAuth from '../hooks/useAuth'

const Index = () => {
  const { userProfile } = useAuth()
  const Tab = createMaterialTopTabNavigator()

  return (
    <Tab.Navigator
      initialRouteName='Main'
      keyboardDismissMode='auto'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 0,
          elevation: 0
        }
      }}
    >
      <Tab.Screen name='AllAdd' component={AllAdd} />
      {
        userProfile?.layout == 'top' ?
          <Tab.Screen name='Main' component={TopNavigation} /> :
          <Tab.Screen name='Main' component={BottomNavigation} />
      }
    </Tab.Navigator>
  )
}

export default Index