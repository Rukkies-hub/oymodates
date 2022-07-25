import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import color from '../style/color'

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import useAuth from '../hooks/useAuth'
import { useFonts } from 'expo-font'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

const { width } = Dimensions.get('window')

import * as NavigationBar from 'expo-navigation-bar'

const AppTheme = () => {
  const { user, userProfile } = useAuth()

  const lightMode = () => updateDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid), { theme: 'light' })

  const darkMode = () => updateDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid), { theme: 'dark' })

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(userProfile?.theme == 'dark' ? color.black : color.white)
    NavigationBar.setButtonStyleAsync(userProfile?.theme == 'dark' ? 'light' : 'dark')
  }, [])

  NavigationBar.setBackgroundColorAsync(userProfile?.theme == 'dark' ? color.black : color.white)
  NavigationBar.setButtonStyleAsync(userProfile?.theme == 'dark' ? 'light' : 'dark')

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        width,
        marginTop: 20
      }}
    >
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
            height: 100,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
            marginRight: 5,
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
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
            <Entypo name='light-down' size={50} color={color.white} />
          </View>
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              fontSize: 18
            }}
          >
            Light
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={darkMode}
          style={{
            flex: 1,
            height: 100,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
            marginLeft: 5,
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
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
            <MaterialCommunityIcons name='theme-light-dark' size={35} color={color.white} />
          </View>
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              fontSize: 18
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