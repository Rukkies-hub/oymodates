import React from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'

import useAuth from '../hooks/useAuth'

import Header from '../components/Header'

import color from '../style/color'

import AutoHeightImage from 'react-native-auto-height-image'

import { useFonts } from 'expo-font'

const Likes = () => {
  const { pendingSwipes } = useAuth()

  const window = Dimensions.get('window')

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showLogo showAratar />

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 20,
          paddingHorizontal: 10
        }}
      >
        <Text
          style={{
            color: color.lightText,
            fontFamily: 'text',
            fontSize: 16,
            textAlign: 'center'
          }}
        >
          Upgrade to Gold to see people who already liked you.
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        {
          pendingSwipes.map((like, index) => {
            return (
              <View
                key={index}
                style={{
                  width: (window.width / 2) - 18,
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: 4,
                  borderColor: color.goldDark
                }}
              >
                <AutoHeightImage
                  resizeMode='cover'
                  blurRadius={50}
                  source={{ uri: like.photoURL }}
                  width={(window.width / 2) - 10}
                />

                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    margin: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 50,
                      backgroundColor: color.goldDark,
                      marginRight: 10
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'text',
                      color: color.white
                    }}
                  >
                    New
                  </Text>
                </View>
              </View>
            )
          })
        }
      </View>
    </View>
  )
}

export default Likes