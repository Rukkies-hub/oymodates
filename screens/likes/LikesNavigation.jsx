import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'

import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Likes from './Likes'
import { useFonts } from 'expo-font'
import Passes from './Passes'

const Tab = createMaterialTopTabNavigator()

const { width } = Dimensions.get('window')

const LikesNavigation = ({ navigation }) => {
  const { userProfile, pendingSwipes } = useAuth()

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
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
      {
        !userProfile &&
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: width - 20,
              minHeight: 10,
              backgroundColor: color.white,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              alignSelf: 'center'
            }}
          >
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 20,
                marginBottom: 20
              }}
            >
              Creat a profile
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                color: color.dark
              }}
            >
              You do not have a profile.
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                color: color.dark
              }}
            >
              Please create a profile to perform any action
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={{
                width: '100%',
                height: 40,
                backgroundColor: color.red,
                marginTop: 20,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.white
                }}
              >
                Create a profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      {
        userProfile &&
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
              title: 'Likes'
            }}
          />

          <Tab.Screen
            name="Passes"
            component={Passes}
          />
        </Tab.Navigator>
      }
    </View>
  )
}

export default LikesNavigation
// in use