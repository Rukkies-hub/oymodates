import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useFonts } from 'expo-font'
import color from '../../../style/color'
import useAuth from '../../../hooks/useAuth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'

const LookingFor = () => {
  const { userProfile, theme, setOverlay } = useAuth()

  const navigation = useNavigation()

  const [lookingFor, setLookingFor] = useState(userProfile?.lookingFor)

  const lookingForMen = async () => {
    setLookingFor('male')
    setOverlay(true)
    navigation.navigate('Overlay')
    try {
      await updateDoc(doc(db, 'users', userProfile?.id), { lookingFor: 'male' })
      setOverlay(false)
    } catch (error) { return }
  }

  const lookingForWomen = async () => {
    setLookingFor('female')
    setOverlay(true)
    navigation.navigate('Overlay')
    try {
      await updateDoc(doc(db, 'users', userProfile?.id), { lookingFor: 'female' })
      setOverlay(false)
    } catch (error) { return }
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          color: color.red,
          fontFamily: 'boldText'
        }}
      >
        Interested in
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
          onPress={lookingForMen}
          style={{
            flex: 1,
            backgroundColor: lookingFor == 'male' ? color.red : theme == 'dark' ? color.dark : color.offWhite,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: lookingFor == 'male' ? color.white : theme == 'dark' ? color.white : color.dark
            }}
          >
            Men
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={lookingForWomen}
          style={{
            flex: 1,
            backgroundColor: lookingFor == 'female' ? color.red : theme == 'dark' ? color.dark : color.offWhite,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: lookingFor == 'female' ? color.white : theme == 'dark' ? color.white : color.dark
            }}
          >
            Women
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LookingFor