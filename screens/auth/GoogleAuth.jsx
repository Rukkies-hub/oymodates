import { View, Text } from 'react-native'
import React from 'react'
import color from '../../style/color'

import * as NavigationBar from 'expo-navigation-bar'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { WebView } from 'react-native-webview'

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from '../../hooks/firebase'

const GoogleAuth = () => {
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  if (isFocused) {
    NavigationBar.setPositionAsync('absolute')
    NavigationBar.setBackgroundColorAsync(color.transparent)
    NavigationBar.setBackgroundColorAsync(color.faintBlack)
    NavigationBar.setButtonStyleAsync('light')
  }

  navigation.addListener('blur', () => {
    NavigationBar.setPositionAsync('relative')
  })

  const provider = new GoogleAuthProvider()
  
  const signIn = () => {}

  const Web = {
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Sign In</title>
        </head>
        <body onload="${signIn() }" style="background-color:#fff;height:100vh">
        </body>
      </html>
    `
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: color.faintBlack
    }}>
      <WebView
        source={Web}
      />
    </View>
  )
}

export default GoogleAuth