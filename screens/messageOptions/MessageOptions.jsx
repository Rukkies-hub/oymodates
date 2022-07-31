import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'

const MessageOptions = () => {
  const { theme } = useAuth()
  const navigation = useNavigation()

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
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
          backgroundColor: color.red
        }}
      />
      <View
        style={{
          backgroundColor: theme == 'dark' ? color.black : color.white,
          width: '100%',
          paddingVertical: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
              marginRight: 5
            }}
          >
            <Text
              style={{
                color: theme == 'dark' ? color.white : color.dark,
                fontFamily: 'text'
              }}
            >
              Block
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
              backgroundColor: color.red,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
              marginLeft: 5
            }}
          >
            <Text
              style={{
                color: theme == 'dark' ? color.white : color.dark,
                fontFamily: 'text'
              }}
            >
              Unmatch
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default MessageOptions