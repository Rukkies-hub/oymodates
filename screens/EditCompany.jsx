import React from "react"

import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput
} from "react-native"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import useAuth from "../hooks/useAuth"

import color from "../style/color"

import { useNavigation } from "@react-navigation/native"

import { useFonts } from "expo-font"

const EditCompany = () => {
  const navigation = useNavigation()
  const { updateCompanyState, updateCompany } = useAuth()

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              height: 45
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <MaterialCommunityIcons name="chevron-left" color={color.dark} size={30} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 10,
                  fontFamily: "text"
                }}
              >
                Company
              </Text>
            </View>
            <TouchableOpacity onPress={updateCompany}>
              <MaterialCommunityIcons name="check" color={color.dark} size={24} />
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: color.white, flex: 1, justifyContent: "center" }}>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 10,
                marginTop: 30
              }}
            >
              <View
                style={{
                  minHeight: 45,
                  marginBottom: 30,
                  borderBottomWidth: 1,
                  borderColor: color.borderColor,
                  position: "relative"
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: color.labelColor,
                    fontFamily: "text"
                  }}
                >
                  Company
                </Text>
                <TextInput
                  autoFocus
                  placeholder="Company name"
                  value={updateCompanyState?.company}
                  onChangeText={updateCompanyState?.setCompany}
                  style={{
                    fontFamily: "text"
                  }}
                />
              </View>
            </View>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default EditCompany