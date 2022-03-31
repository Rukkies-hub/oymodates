import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

import useAuth from "../hooks/useAuth"

const HomeScreen = ({ navigation }) => {
  const {logout} = useAuth()
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title='Log out' onPress={logout} />
    </View>
  )
}

export default HomeScreen