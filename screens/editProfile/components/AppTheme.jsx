import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import color from '../../../style/color'

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import useAuth from '../../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

import * as NavigationBar from 'expo-navigation-bar'

const AppTheme = () => {
  const { user, userProfile, theme, setTheme } = useAuth()

  const lightMode = async () => {
    setTheme('light')
    await updateDoc(doc(db, 'users', userProfile?.id), { theme: 'light' })
  }

  const darkMode = async () => {
    setTheme('dark')
    await updateDoc(doc(db, 'users', userProfile?.id), { theme: 'dark' })
  }

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme == 'dark' ? color.black : color.white)
    NavigationBar.setButtonStyleAsync(theme == 'dark' ? 'light' : 'dark')
  }, [])

  NavigationBar.setBackgroundColorAsync(theme == 'dark' ? color.black : color.white)
  NavigationBar.setButtonStyleAsync(theme == 'dark' ? 'light' : 'dark')

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontFamily: 'boldText',
          color: color.red
        }}
      >
        App Theme
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
            height: 70,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme == 'dark' ? color.dark : color.offWhite,
            marginRight: 5,
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.red,
              marginRight: 10,
              borderRadius: 100,
              position: 'absolute',
              top: -30,
              left: -30,
              paddingTop: 20,
              paddingLeft: 20
            }}
          >
            <Entypo name='light-down' size={30} color={color.white} />
          </View>
          <Text
            style={{
              fontFamily: 'text',
              color: theme == 'dark' ? color.white : color.dark
            }}
          >
            Light
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={darkMode}
          style={{
            flex: 1,
            height: 70,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme == 'dark' ? color.dark : color.offWhite,
            marginLeft: 5,
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.red,
              marginRight: 10,
              borderRadius: 100,
              position: 'absolute',
              top: -30,
              left: -30,
              paddingTop: 20,
              paddingLeft: 20
            }}
          >
            <MaterialCommunityIcons name='theme-light-dark' size={25} color={color.white} />
          </View>
          <Text
            style={{
              fontFamily: 'text',
              color: theme == 'dark' ? color.white : color.dark
            }}
          >
            Dark
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AppTheme
// in use