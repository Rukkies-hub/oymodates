import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import Header from '../components/Header'
import Bar from '../components/StatusBar'
import color from '../style/color'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'

import { Entypo, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons'

import * as NavigationBar from 'expo-navigation-bar'

const AccountSettings = () => {
  const { user, userProfile } = useAuth()

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black)
    NavigationBar.setButtonStyleAsync(userProfile?.appMode == 'light' ? 'dark' : 'light')
  }, [])

  const lightMode = () => {
    updateDoc(doc(db, 'users', user?.uid), {
      appMode: 'light'
    })
  }

  const darkMode = () => {
    updateDoc(doc(db, 'users', user?.uid), {
      appMode: 'dark'
    })
  }

  const lightsOut = () => {
    updateDoc(doc(db, 'users', user?.uid), {
      appMode: 'lightsOut'
    })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
        paddingHorizontal: 10
      }}
    >
      <Bar color={userProfile?.appMode == 'light' ? 'dark' : 'light'} />
      <Header
        showBack
        showTitle
        title='Account settings'
        showAratar
      />

      <View>
        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: userProfile?.appMode == 'light' ? color.dark : color.white
          }}
        >
          App mode
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <TouchableOpacity
            onPress={lightMode}
            style={{
              flex: 1,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.offWhite,
              borderRadius: 4,
              marginRight: 2,
              flexDirection: 'row'
            }}
          >
            <Entypo name="light-down" size={24} color={color.red} />
            <Text
              style={{
                fontFamily: 'text',
                color: color.red,
                marginLeft: 10
              }}
            >
              Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={darkMode}
            style={{
              flex: 1,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.red,
              borderRadius: 4,
              marginLeft: 2,
              flexDirection: 'row'
            }}
          >
            <MaterialCommunityIcons name="theme-light-dark" size={22} color={color.white} />
            <Text
              style={{
                fontFamily: 'text',
                color: color.white,
                marginLeft: 10
              }}
            >
              Dark
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={lightsOut}
            style={{
              flex: 1,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.lightText,
              borderRadius: 4,
              marginLeft: 2,
              flexDirection: 'row'
            }}
          >
            <Fontisto name="night-alt-cloudy" size={20} color={color.white} />
            <Text
              style={{
                fontFamily: 'text',
                color: color.white,
                marginLeft: 10
              }}
            >
              Lights out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AccountSettings