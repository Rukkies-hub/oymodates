import { SafeAreaView, View, Text, TextInput, Dimensions, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'

import color from '../style/color'

import { MaterialIcons, Ionicons } from '@expo/vector-icons'

const Login = () => {

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        backgroundColor: color.black,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
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
          <MaterialIcons name="alternate-email" size={24} color={color.white} style={{ marginHorizontal: 10 }} />
          <TextInput
            placeholder='Email'
            placeholderTextColor={color.white}
            style={{
              flex: 1,
              fontFamily: 'text'
            }}
          />
        </View>

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
          <Ionicons name="lock-open-outline" size={24} color={color.white} style={{ marginHorizontal: 10 }} />
          <TextInput
            placeholder='Email'
            placeholderTextColor={color.white}
            style={{
              flex: 1,
              fontFamily: 'text'
            }}
          />
        </View>

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
            style={{
              flex: 1,
              height: 45,
              backgroundColor: color.red,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: color.white
              }}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
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
          <TouchableOpacity>
            <Text style={{ color: color.white, fontSize: 12 }}>Don't have an account?</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ color: color.white, fontSize: 12 }}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login