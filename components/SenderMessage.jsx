import { View, Text, Image } from 'react-native'
import React from 'react'

import color from "../style/color"
import useAuth from '../hooks/useAuth'

const SenderMessage = ({ messages }) => {
  const { userProfile } = useAuth()
  return (
    <View style={{ flexDirection: "row-reverse", marginBottom: 10 }}>
      <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={{ uri: userProfile.avatar }} />
      <View
        style={{
          backgroundColor: color.purple,
          paddingVertical: 10,
          paddingHorizontal: 15,
          alignSelf: "flex-end",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginRight: 10,
          maxWidth: "80%"
        }}
      >
        <Text
          style={{ color: "#fff", fontSize: 18 }}
        >
          {messages.message}
        </Text>
      </View>
    </View>
  )
}

export default SenderMessage