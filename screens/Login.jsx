import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import useAuth from '../hooks/useAuth'

import color from "../style/color"

import Bar from '../components/StatusBar'

const Login = () => {
  const { signInWighGoogle } = useAuth()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white
      }}
    >
      <Bar />
      <Text>Login</Text>
      <Button onPress={signInWighGoogle} title='Login' />
    </View>
  )
}

export default Login