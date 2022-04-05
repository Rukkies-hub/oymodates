import { View, Text, Image } from 'react-native'
import React from 'react'

const RecieverMessage = ({ messages }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <Image
        style={{ width: 30, height: 30, borderRadius: 50 }}
        source={{ uri: messages.avatar }}
      />
      <View
        style={{
          backgroundColor: "#FF4757",
          paddingVertical: 6,
          paddingHorizontal: 15,
          alignSelf: "flex-end",
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          marginLeft: 10
        }}
      >
        {
          messages.message && <Text
            style={{ color: "#fff", fontSize: 18, textAlign: "left" }}
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

export default RecieverMessage