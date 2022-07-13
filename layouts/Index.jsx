import React, { useLayoutEffect } from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import AllAdd from '../screens/AllAdd'
import BottomNavigation from './BottomNavigation'
import TopNavigation from './TopNavigation'
import useAuth from '../hooks/useAuth'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useNavigation } from '@react-navigation/native'

const Index = () => {
  const { userProfile, user } = useAuth()
  const Tab = createMaterialTopTabNavigator()

  const navigation = useNavigation()

  useLayoutEffect(() =>
    (() => {
      onSnapshot(doc(db, 'users', user?.uid),
        snapshot => {
          if (!snapshot?.exists()) navigation.navigate('EditProfile', { setup: true })
        })
    })()
    , [])

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