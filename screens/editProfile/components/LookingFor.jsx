import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'
import color from '../../../style/color'
import useAuth from '../../../hooks/useAuth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const LookingFor = () => {
  const { lookingFor, setLookingFor, userProfile, theme } = useAuth()

  const lookingForMen = () => {
    setLookingFor('men')
    updateDoc(doc(db, 'users', userProfile?.id), { lookingFor: 'men' })
  }

  const lookingForWomen = () => {
    setLookingFor('women')
    updateDoc(doc(db, 'users', userProfile?.id), { lookingFor: 'women' })
  }

  const lookingForAll = () => {
    setLookingFor('all')
    updateDoc(doc(db, 'users', userProfile?.id), { lookingFor: 'all' })
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
        Looking for
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
            backgroundColor: lookingFor == 'men' ? color.red : theme == 'dark' ? color.dark : color.offWhite,
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
              color: lookingFor == 'men' ? color.white : theme == 'dark' ? color.white : color.dark
            }}
          >
            Men
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={lookingForWomen}
          style={{
            flex: 1,
            backgroundColor: lookingFor == 'women' ? color.red : theme == 'dark' ? color.dark : color.offWhite,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: lookingFor == 'women' ? color.white : theme == 'dark' ? color.white : color.dark
            }}
          >
            Women
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={lookingForAll}
          style={{
            flex: 1,
            backgroundColor: lookingFor == 'all' ? color.red : theme == 'dark' ? color.dark : color.offWhite,
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
              color: lookingFor == 'all' ? color.white : theme == 'dark' ? color.white : color.dark
            }}
          >
            Everyone
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LookingFor