import React from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

const SenderMessage = ({ messages, matchDetails }) => {
  const { userProfile, user } = useAuth()

  console.log(userProfile)
  return (
    <View style={{ flexDirection: "row-reverse", marginBottom: 10 }}>
      <Image
        style={{ width: 30, height: 30, borderRadius: 50 }}
        source={{ uri: userProfile?.photoURL }}
      />
      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 10,
          maxWidth: "80%"
        }}
      >
        <Pressable
          style={{
            backgroundColor: messages.message ? color.blue : color.transparent,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          {
            messages?.message && <Text
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
                borderColor: color.blue,
                right: 6
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

export default SenderMessage