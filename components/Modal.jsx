import React from "react"

import { View, Text, TouchableOpacity } from "react-native"

import { useNavigation, useRoute } from "@react-navigation/native"

import color from "../style/color"

import { useFonts } from "expo-font"

export default () => {
  const navigation = useNavigation()
  const { params } = useRoute()

  const { title, body, dismis } = params

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.transparent,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View
        style={{
          backgroundColor: color.white,
          width: "90%",
          padding: 20,
          borderRadius: 15
        }}
      >
        <Text
          style={{
            fontFamily: "text",
            fontSize: 20,
            color: color.dark
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontFamily: "text",
            color: color.dark
          }}
        >
          {body}
        </Text>

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {
            dismis &&
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: color.red,
                borderRadius: 12,
                height: 50,
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: color.white,
                  fontFamily: "text",
                  fontSize: 14
                }}
              >
                Dismis
              </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}
