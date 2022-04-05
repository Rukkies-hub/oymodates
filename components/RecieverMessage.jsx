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
        <Text style={{ color: "#fff", fontSize: 18, textAlign: "left" }}>{messages.message}</Text>
      </View>
    </View>
  )
}

export default RecieverMessage