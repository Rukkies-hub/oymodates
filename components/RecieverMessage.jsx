import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import color from '../style/color'

const RecieverMessage = ({ messages, matchDetails }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <Image
        style={{ width: 30, height: 30, borderRadius: 50 }}
        source={{ uri: messages?.photoURL }}
      />
      <View
        style={{
          alignSelf: "flex-end",
          marginLeft: 1,
          maxWidth: "80%"
        }}
      >
        <Pressable
          style={{
            backgroundColor: messages?.message ? color.red : color.transparent,
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
            messages?.message &&
            <Text
              style={{ color: color.white, fontSize: 18, textAlign: "right" }}
            >
              {messages?.message}
            </Text>
          }
          {
            messages?.image &&
            <View
              style={{
                position: "relative",
                width: 300,
                height: 300,
                borderWidth: 2,
                borderRadius: 20,
                overflow: "hidden",
                borderColor: color.red,
                left: 16
              }}
            >
              <Image style={{
                flex: 1,
                width: "100%",
                height: "100%"
              }}
                source={{ uri: messages?.image }}
              />
              {
                messages?.caption &&
                <View
                  style={{
                    width: "100%",
                    height: 30,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    backgroundColor: color.white,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingHorizontal: 10
                  }}
                >
                  <Text>{messages?.caption}</Text>
                </View>
              }
            </View>
          }
        </Pressable>
      </View>
    </View>
  )
}

export default RecieverMessage