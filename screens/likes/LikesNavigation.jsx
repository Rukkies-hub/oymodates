import { View, Text } from 'react-native'
import React from 'react'

import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Likes from './Likes'
import { useFonts } from 'expo-font'
import Swipes from './Swipes'
import Passes from './Passes'

const Tab = createMaterialTopTabNavigator()

const LikesNavigation = () => {
  const { userProfile } = useAuth()

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    lightText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
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
        initialRouteName='Swipes'
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
          name="Likes"
          component={Likes}
          options={{
            swipeEnabled: false
          }}
        />

        <Tab.Screen
          name="Swipes"
          component={Swipes}
          options={{
            swipeEnabled: false
          }}
        />

        <Tab.Screen
          name="Passes"
          component={Passes}
          options={{
            swipeEnabled: false
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default LikesNavigation