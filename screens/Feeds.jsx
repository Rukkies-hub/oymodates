import { View, Text } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import color from '../style/color'

const Feeds = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showLogo showAratar />
      <Text>Feeds</Text>
    </View>
  )
}

export default Feeds