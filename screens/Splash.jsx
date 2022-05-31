import React, { useEffect } from 'react'
import { Text, SafeAreaView, ActivityIndicator } from 'react-native'

import * as NavigationBar from 'expo-navigation-bar'
import Bar from '../components/StatusBar'
import color from '../style/color'
import { useFonts } from 'expo-font'

const Splash = () => {

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  }, [])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white
      }}
    >
      <Bar style={'light'} />
      <Text
        style={{
          fontFamily: 'logo',
          fontSize: 40,
          marginBottom: 20
        }}
      >
        Oymo
      </Text>
      <ActivityIndicator size='large' color={color.red} />
    </SafeAreaView>
  )
}

export default Splash