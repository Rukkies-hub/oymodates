import React from 'react'
import { View, SafeAreaView } from 'react-native'
import Header from '../components/Header'
import color from '../style/color'

import { useFonts } from 'expo-font'
import Posts from '../components/Posts'

import Bar from "../components/StatusBar"

const Feeds = () => {

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
      <Bar />
      <Header showLogo showAratar showAdd />

      <Posts />
    </View>
  )
}

export default Feeds