import React from 'react'
import { View, Text, TextInput } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { Entypo } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

const SearchChat = () => {
  const { userProfile } = useAuth()

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        height: 40,
        backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        paddingHorizontal: 10
      }}
    >
      <Entypo name="magnifying-glass" size={24} color={userProfile?.theme == 'dark' ? color.white : color.lightText} />
      <TextInput
        placeholder='Search'
        placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.lightText}
        style={{
          flex: 1,
          marginLeft: 10,
          fontFamily: 'text',
          color: userProfile?.theme == 'dark' ? color.white : color.dark
        }}
      />
    </View>
  )
}

export default SearchChat