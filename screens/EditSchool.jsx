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

import editProfile from "../style/editProfile"

import useAuth from "../hooks/useAuth"

import { useFonts } from "expo-font"

import color from "../style/color"

import { useNavigation } from "@react-navigation/native"

const EditSchool = () => {
  const navigation = useNavigation()
  const { updateSchoolState, updateSchool } = useAuth()

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={editProfile.container}
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
                School
              </Text>
            </View>
            <TouchableOpacity
              onPress={updateSchool}
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <MaterialCommunityIcons name="check" color={color.dark} size={24} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: color.white,
              flex: 1,
              justifyContent: "center"
            }}
          >
            <View style={editProfile.form}>
              <View style={editProfile.inputField}>
                <Text
                  style={{
                    fontSize: 12,
                    color: color.labelColor,
                    fontFamily: "text"
                  }}
                >
                  Where did you school?
                </Text>
                <TextInput
                  autoFocus
                  placeholder="Enter school name"
                  value={updateSchoolState?.school}
                  onChangeText={updateSchoolState?.setSchool}
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

export default EditSchool