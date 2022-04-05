import { View, Text, Image, Pressable, LayoutAnimation, UIManager } from 'react-native'
import React, { useState } from 'react'

import color from "../style/color"
import useAuth from '../hooks/useAuth'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

const RecieverMessage = ({ messages }) => {
  const { userProfile } = useAuth()

  const [expanded, setExpanded] = useState(false)

  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <Image
        style={{ width: 30, height: 30, borderRadius: 50 }}
        source={{ uri: messages.avatar }}
      />
      <View
        style={{
          alignSelf: "flex-end",
          marginLeft: 1,
          maxWidth: "80%"
        }}
      >
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setExpanded(!expanded)
          }}
          style={{
            backgroundColor: messages.message ? "#FF4757" : "transparent",
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
              style={{ color: "#fff", fontSize: 18, textAlign: "right" }}
            >
              {messages.message}
            </Text>
          }
          {
            messages.image &&
            <View
              style={{
                position: "relative",
                width: 300,
                height: 300,
                borderWidth: 2,
                borderRadius: 20,
                overflow: "hidden",
                borderColor: "#FF4757",
                left: 16
              }}
            >
              <Image style={{
                flex: 1,
                width: "100%",
                height: "100%"
              }}
                source={{ uri: messages.image }}
              />
              <View
                style={{
                  width: "100%",
                  height: 30,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingHorizontal: 10
                }}
              >
                <Text>{messages.caption}</Text>
              </View>
            </View>
          }
        </Pressable>
      </View>
    </View>
  )
}

export default RecieverMessage