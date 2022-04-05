import { View, Text, Image, useWindowDimensions } from 'react-native'
import React from 'react'

import color from "../style/color"
import useAuth from '../hooks/useAuth'

const SenderMessage = ({ messages }) => {
  const { userProfile } = useAuth()
  const window = useWindowDimensions()
  return (
    <View style={{ flexDirection: "row-reverse", marginBottom: 10 }}>
      <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={{ uri: userProfile.avatar }} />
      <View
        style={{
          backgroundColor: messages.message ? color.purple : "#fff",
          paddingVertical: 6,
          paddingHorizontal: 15,
          alignSelf: "flex-end",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginRight: 10,
          maxWidth: "80%"
        }}
      >
        {
          messages.message && <Text
            style={{ color: "#fff", fontSize: 18, textAlign: "right" }}
          >
            {messages.message}
          </Text>
        }
        {
          messages.image && <Image style={{
            flex: 1,
            width: window.width - 100,
            height: 300,
            borderRadius: 20
          }}
            source={{ uri: messages.image }}
          />
        }
      </View>
    </View>
  )
}

export default SenderMessage