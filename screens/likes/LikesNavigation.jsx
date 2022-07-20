import { View, Text } from 'react-native'
import React from 'react'

import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Likes from './Likes'
import { useFonts } from 'expo-font'
import Passes from './Passes'

const Tab = createMaterialTopTabNavigator()

const LikesNavigation = () => {
  const { userProfile, pendingSwipes } = useAuth()

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      <Tab.Navigator
        initialRouteName='PendingLikes'
        keyboardDismissMode='auto'
        screenOptions={{
          lazy: false,
          tabBarIndicatorStyle: {
            backgroundColor: userProfile?.theme == 'dark' ? color.offWhite : color.dark,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50
          },
          tabBarStyle: {
            backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
            height: 45,
            elevation: 0
          },
          tabBarLabelStyle: {
            color: userProfile?.theme == 'dark' ? color.white : color.lightText,
            fontFamily: 'text',
            textTransform: 'capitalize'
          }
        }}
      >
        <Tab.Screen
          name="PendingLikes"
          component={Likes}
          options={{
            swipeEnabled: pendingSwipes?.length ? false : true,
            title: 'Likes'
          }}
        />

        <Tab.Screen
          name="Passes"
          component={Passes}
        />
      </Tab.Navigator>
    </View>
  )
}

export default LikesNavigation