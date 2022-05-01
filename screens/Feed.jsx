import React from "react"

import { View, SafeAreaView, Text, TouchableOpacity } from "react-native"

import color from "../style/color"

import { useFonts } from "expo-font"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { useNavigation } from "@react-navigation/native"

import Header from "../components/Header"

const Feed = () => {
  const navigation = useNavigation()

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header title="Feeds" />

      <View
        style={{
          paddingHorizontal: 10
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Add")}
          style={{
            width: "100%",
            height: 45,
            borderWidth: 1,
            borderColor: color.borderColor,
            borderRadius: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: 10
          }}
        >
          <Text
            style={{
              color: color.lightText,
              fontFamily: "text",
              fontSize: 14
            }}
          >
            What's on your mind...
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Feed