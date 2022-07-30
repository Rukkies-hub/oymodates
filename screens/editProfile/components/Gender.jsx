import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import color from '../../../style/color'
import useAuth from '../../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { Foundation } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const { width } = Dimensions.get('window')

const Gender = () => {
  const { theme, userProfile } = useAuth()
  const navigation = useNavigation()

  const [maleLoading, setMaleLoading] = useState(false)
  const [femaleLoading, setFemaleLoading] = useState(false)

  const maleGender = () => {
    setMaleLoading(true)
    updateDoc(doc(db, 'users', userProfile?.id), { gender: 'male' })
      .finally(() => {
        setMaleLoading(false)
        navigation.goBack()
      })
  }

  const femaleGender = () => {
    setFemaleLoading(true)
    updateDoc(doc(db, 'users', userProfile?.id), { gender: 'female' })
      .finally(() => {
        setFemaleLoading(false)
        navigation.goBack()
      })
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.faintBlack,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flex: 1,
          width: '100%'
        }}
      />

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: width,
          backgroundColor: theme == 'dark' ? color.black : color.white,
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}
      >
        <Text
          style={{
            color: color.red,
            fontFamily: 'boldText',
            fontSize: 30
          }}
        >
          Warning!!!
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontFamily: 'text',
            color: theme == 'dark' ? color.white : color.dark
          }}
        >
          You only have one chance to change this information
        </Text>

        <TouchableOpacity
          onPress={maleGender}
          style={{
            height: 50,
            backgroundColor: color.red,
            paddingHorizontal: 10,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10
          }}
        >
          {
            !maleLoading ?
              <>
                <Foundation name='male-symbol' size={24} color={color.white} />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    fontSize: 18,
                    marginLeft: 10
                  }}
                >
                  Male (Man)
                </Text>
              </> :
              <ActivityIndicator size='small' color={color.white} />
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={femaleGender}
          style={{
            height: 50,
            backgroundColor: color.darkBlue,
            paddingHorizontal: 10,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10
          }}
        >
          {
            !femaleLoading ?
              <>
                <Foundation name='female-symbol' size={24} color={color.white} />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    fontSize: 18,
                    marginLeft: 10
                  }}
                >
                  Female (Woman)
                </Text>
              </> :
              <ActivityIndicator size='small' color={color.white} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Gender