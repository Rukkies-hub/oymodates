import { Image } from 'react-native'
import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MyReels from './MyReels'
import MyPosts from './MyPosts'
const Tab = createMaterialTopTabNavigator()

import { MaterialCommunityIcons } from '@expo/vector-icons'
import color from '../../style/color'

const ProfileTabs = ({ userProfile }) => {
  return (
    <Tab.Navigator
      initialRouteName='MyReels'
      barStyle={{
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
        height: 50,
        elevation: 0
      }}
      keyboardDismissMode='auto'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
          height: 50,
          elevation: 0
        },
        tabBarIndicatorStyle: {
          backgroundColor: userProfile.theme == 'dark' ? color.offWhite : color.dark,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50
        }
      }}
    >
      <Tab.Screen
        name='MyReels'
        component={MyReels}
        options={{
          tabBarIcon: () =>
            <Image
              source={userProfile?.theme == 'dark' ? require('../../assets/videoLight.png') : require('../../assets/video.png')}
              style={{
                width: 20,
                height: 20
              }}
            />
        }}
      />
      <Tab.Screen
        name='MyPosts'
        component={MyPosts}
        options={{
          tabBarIcon: () => <MaterialCommunityIcons name='grid' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
        }}
      />
    </Tab.Navigator>
  )
}

export default ProfileTabs