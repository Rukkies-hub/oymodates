import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import color from '../../style/color'

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const { width } = Dimensions.get('window')

const AppTheme = () => {
  const { user, userProfile } = useAuth()

  const lightMode = () => updateDoc(doc(db, 'users', user?.uid), { theme: 'light' })

  const darkMode = () => updateDoc(doc(db, 'users', user?.uid), { theme: 'dark' })

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        width,
        paddingHorizontal: 10
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
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.offWhite,
            borderRadius: 12,
            marginRight: 5
          }}
        >
          <Entypo name='light-down' size={30} color={color.dark} />
          <Text
            style={{
              fontFamily: 'text',
              color: color.dark,
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
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.dark,
            borderRadius: 12,
            marginLeft: 5
          }}
        >
          <MaterialCommunityIcons name='theme-light-dark' size={30} color={color.white} />
          <Text
            style={{
              fontFamily: 'text',
              color: color.white,
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