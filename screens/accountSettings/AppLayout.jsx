import React from 'react'
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native'
import color from '../../style/color'

import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import AutoHeightImage from 'react-native-auto-height-image'

const { width } = Dimensions.get('window')

const AppLayout = () => {
  const { user, userProfile } = useAuth()

  const bottomLayout = () => updateDoc(doc(db, 'users', user?.uid), { layout: 'bottom' })

  const topLayout = () => updateDoc(doc(db, 'users', user?.uid), { layout: 'top' })

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        width,
        paddingHorizontal: 10,
        marginTop: 40
      }}
    >
      <Text
        style={{
          fontFamily: 'boldText',
          color: color.red
        }}
      >
        App Layout
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10
        }}
      >
        <TouchableOpacity onPress={bottomLayout}>
          <AutoHeightImage
            source={
              Platform.OS == 'android' ?
                (userProfile?.theme == 'dark' ? require('../../assets/tabBottomAndroidDark.png') : require('../../assets/tabBottomAndroidLight.png')) :
                (userProfile?.theme == 'dark' ? require('../../assets/tabBottomIOSDark.png') : require('../../assets/tabBottomIOSLight.png'))
            }
            width={(width / 2) - 20}
            resizeMode='cover'
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={topLayout}>
          <AutoHeightImage
            source={
              Platform.OS == 'android' ? (userProfile?.theme == 'dark' ? require('../../assets/tabTopAndroidDark.png') : require('../../assets/tabTopAndroidLight.png')) :
                (userProfile?.theme == 'dark' ? require('../../assets/tabTopIOSDark.png') : require('../../assets/tabTopIOSLight.png'))
            }
            width={(width / 2) - 20}
            resizeMode='cover'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AppLayout