import { View, Text } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'
import color from '../style/color'

const Likes = () => {
  const { pendingSwipes } = useAuth()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showLogo showAratar />
      <Text>Likes</Text>
    </View>
  )
}

export default Likes