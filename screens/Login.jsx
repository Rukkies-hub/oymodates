import React, { useEffect } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  Image
} from 'react-native'
import useAuth from '../hooks/useAuth'

import color from '../style/color'

import Bar from '../components/StatusBar'

import { useFonts } from 'expo-font'

import { MaterialIcons, Ionicons } from '@expo/vector-icons'

import * as NavigationBar from 'expo-navigation-bar'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const Login = () => {
  const {
    signinEmail,
    setSigninEmail,
    signinPassword,
    setSigninPassword,
    securePasswordEntry,
    setSecurePasswordEntry,
    authType,
    setAuthType,
    authLoading,
    signup,
    signin,
    recoverPassword,
    googlePromptAsync,
    fbPromptAsync
  } = useAuth()

  const isFocused = useIsFocused()
  const navigation = useNavigation()

  if (isFocused) {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }

  navigation.addListener('blur', () => {
    NavigationBar.setVisibilityAsync('visible')
  })

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      resizeMode='cover'
      blurRadius={10}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        paddingHorizontal: 10,
        width: Dimensions.get('window').width
      }}
    >
      <Bar color='light' />

      <Text
        style={{
          fontFamily: 'logo',
          color: color.white,
          fontSize: 50
        }}
      >
        Oymo
      </Text>

      <View
        style={{
          width: '100%',
          marginTop: 40
        }}
      >
        <View
          style={{
            height: 45,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: color.lightBorderColor,
            marginHorizontal: 20,
            borderRadius: 12,
            overflow: 'hidden'
          }}
        >
          <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
          <TextInput
            placeholder='Email'
            value={signinEmail}
            onChangeText={setSigninEmail}
            placeholderTextColor={color.white}
            style={{
              flex: 1,
              fontFamily: 'text',
              color: color.white
            }}
          />
        </View>

        {
          authType != 'forgotPassword' &&
          <View
            style={{
              height: 45,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: color.lightBorderColor,
              marginHorizontal: 20,
              borderRadius: 12,
              marginTop: 20,
              overflow: 'hidden'
            }}
          >
            <Ionicons name='lock-open-outline' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
            <TextInput
              placeholder='Password'
              value={signinPassword}
              onChangeText={setSigninPassword}
              placeholderTextColor={color.white}
              secureTextEntry={securePasswordEntry}
              style={{
                flex: 1,
                fontFamily: 'text',
                color: color.white
              }}
            />
            <TouchableOpacity
              onPress={() => setSecurePasswordEntry(!securePasswordEntry)}
              style={{
                width: 45,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Ionicons name={securePasswordEntry ? 'ios-eye-outline' : 'ios-eye-off-outline'} size={24} color={color.white} style={{ marginHorizontal: 10 }} />
            </TouchableOpacity>
          </View>
        }

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 20,
            marginTop: 20
          }}
        >
          <TouchableOpacity
            onPress={() => authType == 'login' ? signin() : authType == 'signup' ? signup() : recoverPassword()}
            style={{
              flex: 1,
              height: 45,
              backgroundColor: color.red,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {
              authLoading ? <ActivityIndicator size='small' color={color.white} /> :
                <Text
                  style={{
                    fontFamily: 'text',
                    fontSize: 16,
                    color: color.white
                  }}
                >
                  {authType == 'login' ? 'Login' : authType == 'signup' ? 'Sign Up' : 'Forgot Password'}
                </Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => fbPromptAsync()}
            style={{
              width: 45,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.white,
              borderRadius: 12,
              marginLeft: 20
            }}
          >
            <Image
              source={require('../assets/facebook.png')}
              style={{
                width: 25,
                height: 25
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => googlePromptAsync()}
            style={{
              width: 45,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.white,
              borderRadius: 12,
              marginLeft: 20
            }}
          >
            <Image
              source={require('../assets/google.png')}
              style={{
                width: 25,
                height: 25
              }}
            />

          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
            marginHorizontal: 20
          }}
        >
          <TouchableOpacity
            onPress={() => setAuthType(authType == 'login' ? 'signup' : 'login')}
          >
            <Text style={{ color: color.white, fontSize: 12 }}>Don't have an account?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAuthType(authType == 'forgotPassword' ? 'signin' : 'forgotPassword')}>
            <Text style={{ color: color.white, fontSize: 12 }}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Login