import React from 'react'
import { View, Text, Button } from 'react-native'

import { useNavigation } from '@react-navigation/native'

const Home = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Text>Home</Text>
      <Button onPress={() => navigation.navigate("Chat")} title='Go to chat' />
    </View>
  )
}

export default Home