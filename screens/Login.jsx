import React, { useEffect } from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'
import useAuth from '../hooks/useAuth'

import color from '../style/color'

import Bar from '../components/StatusBar'

import { useFonts } from 'expo-font'

import * as NavigationBar from 'expo-navigation-bar'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
  const navigation = useNavigation()
  const {
    signInWighGoogle,
    loading
  } = useAuth()

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        paddingHorizontal: 10,
        width: Dimensions.get('window').width
      }}
    >
      <Bar color={'light'} />

      <Text
        style={{
          fontFamily: 'logo',
          color: color.white,
          fontSize: 50,
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
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.white
        }}
      >
        <Text
          style={{
            marginRight: 10,
            fontFamily: 'text',
            fontSize: 16
          }}
        >
          Continue with Google
        </Text>
        {
          loading ? <ActivityIndicator color={color.red} size='small' /> :
            <Image
              source={require('../assets/google.png')}
              style={{
                width: 20,
                height: 20
              }}
            />
        }
      </TouchableOpacity>
    </ImageBackground>
  )
}

export default Login