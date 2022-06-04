import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import Header from '../components/Header'
import Bar from '../components/StatusBar'
import color from '../style/color'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'

const AccountSettings = () => {
  const { user, getUserProfile } = useAuth()

  const lightMode = () => {
    updateDoc(doc(db, 'users', user.uid), {
      appMode: 'light'
    }).then(() => getUserProfile(user))
  }

  const darkMode = () => {
    updateDoc(doc(db, 'users', user.uid), {
      appMode: 'dark'
    }).then(() => getUserProfile(user))
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white,
        paddingHorizontal: 10
      }}
    >
      <Bar style={'light'} />
      <Header
        showBack
        showTitle
        title='Account settings'
        showAratar
      />

      <View>
        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: color.dark
          }}
        >
          App mode
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
            onPress={lightMode}
            style={{
              flex: 1,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.offWhite,
              borderRadius: 4,
              marginRight: 2
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                color: color.red
              }}
            >
              Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={darkMode}
            style={{
              flex: 1,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.red,
              borderRadius: 4,
              marginLeft: 2
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                color: color.white
              }}
            >
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AccountSettings