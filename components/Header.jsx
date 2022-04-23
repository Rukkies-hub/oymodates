import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { useFonts } from 'expo-font'

import color from "../style/color"

export default ({ title, callEnabled }) => {
  const navigation = useNavigation()

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 45,
      paddingHorizontal: 10
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center"
        }}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginLeft: 10,
            color: color.dark,
            fontFamily: "text"
          }}
        >
          {title}
        </Text>
      </View>
      {callEnabled && (
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <MaterialCommunityIcons name="phone-outline" color={color.dark} size={30} />
        </TouchableOpacity>
      )}
    </View>
  )
}
