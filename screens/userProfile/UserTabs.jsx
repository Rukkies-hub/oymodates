import React from 'react'
import { Image } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import color from '../../style/color'
import UserPosts from './UserPosts'
import UserReels from './UserReels'

const Tab = createMaterialTopTabNavigator()

const UserTabs = ({ userProfile }) => {
  return (
    <Tab.Navigator
      initialRouteName='UserReels'
      keyboardDismissMode='auto'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
          height: 45,
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
        name='UserReels'
        component={UserReels}
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
        name='UserPosts'
        component={UserPosts}
        options={{
          tabBarIcon: () => <MaterialCommunityIcons name='grid' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
        }}
      />
    </Tab.Navigator>
  )
}

export default UserTabs