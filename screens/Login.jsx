import React from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import useAuth from '../hooks/useAuth'

import color from '../style/color'

import Bar from '../components/StatusBar'

import { useFonts } from 'expo-font'

import { MaterialIcons, Feather } from '@expo/vector-icons'

const Login = () => {
  const {
    signInWighGoogle,
    loading,
    secureTextEntry,
    setSecureTextEntry,
    authloading,
    setAuthLoading,
    signinEmail,
    setSigninEmail,
    signinPassword,
    setSigninPassword,
    paswordSignin
  } = useAuth()

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

      <View>
        <View
          style={{
            position: 'relative',
            height: 50,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: color.offWhite,
            borderRadius: 12
          }}
        >
          <MaterialIcons
            name="alternate-email"
            size={20}
            color={color.dark}
            style={{
              marginHorizontal: 10
            }}
          />
          <TextInput
            value={signinEmail}
            placeholder='Email'
            onChangeText={setSigninEmail}
            style={{
              flex: 1,
              fontSize: 16,
              height: '100%',
              fontFamily: 'text',
            }}
          />
        </View>

        <View
          style={{
            position: 'relative',
            height: 50,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: color.offWhite,
            borderRadius: 12,
            marginTop: 15
          }}
        >
          <MaterialIcons
            name="lock-outline"
            size={20}
            color="black"
            style={{
              marginHorizontal: 10
            }}
          />
          <TextInput
            value={signinPassword}
            placeholder='Password'
            onChangeText={setSigninPassword}
            secureTextEntry={secureTextEntry}
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: 'text'
            }}
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            {
              secureTextEntry ?
                <Feather name="eye" size={20} color="black" /> :
                <Feather name="eye-off" size={20} color="black" />
            }
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 15,
            height: 50
          }}
        >
          <TouchableOpacity
            onPress={paswordSignin}
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: color.red,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12
            }}
          >
            {
              authloading ? <ActivityIndicator color={color.red} size='small' /> :
                <Text
                  style={{
                    fontFamily: 'text',
                    fontSize: 16,
                    color: color.white
                  }}
                >
                  Sign In
                </Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signInWighGoogle}
            style={{
              width: 50,
              height: '100%',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: color.borderColor,
              marginLeft: 15,
            }}
          >
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
        </View>
      </View>

    </SafeAreaView>
  )
}

export default Login