import React, { useState } from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'

import color from '../style/color'

import Bar from '../components/StatusBar'

import { useFonts } from 'expo-font'

const Login = () => {
  const { signInWighGoogle, loading } = useAuth()

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.red
      }}
    >
      <Bar />

      <Text
        style={{
          fontFamily: 'logo',
          color: color.white,
          fontSize: 40,
          marginBottom: 20
        }}
      >
        Oymo
      </Text>

      <TouchableOpacity
        onPress={signInWighGoogle}
        style={{
          width: '80%',
          height: 50,
          borderRadius: 12,
          backgroundColor: color.white,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {
          loading ? <ActivityIndicator color={color.red} size='large' />
            :
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../assets/google.png')}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10
                }}
              />
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.dark
                }}
              >
                Continue with Google
              </Text>
            </View>
        }
      </TouchableOpacity>
    </View>
  )
}

export default Login