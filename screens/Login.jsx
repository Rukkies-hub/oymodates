import React, { useLayoutEffect } from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native'
import useAuth from '../hooks/useAuth'

import color from '../style/color'

import Bar from '../components/StatusBar'

import { useFonts } from 'expo-font'

import * as NavigationBar from 'expo-navigation-bar'

const Login = () => {
  const { signInWighGoogle, loading } = useAuth()

  NavigationBar.setBackgroundColorAsync(color.white)
  NavigationBar.setButtonStyleAsync('dark')

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        paddingHorizontal: 10
      }}
    >
      <Bar color={'dark'} />

      <Text
        style={{
          fontFamily: 'logo',
          color: color.dark,
          fontSize: 50,
          marginBottom: 20
        }}
      >
        Oymo
      </Text>

      <TouchableOpacity
        onPress={signInWighGoogle}
        style={{
          width: '100%',
          height: 50,
          borderRadius: 4,
          backgroundColor: color.transparent,
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
                  color: color.red
                }}
              >
                Continue with Google
              </Text>
            </View>
        }
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Login