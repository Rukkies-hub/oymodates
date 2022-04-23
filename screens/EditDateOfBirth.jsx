import React from "react"

import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from "react-native"

import DatePicker from "react-native-datepicker"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import useAuth from "../hooks/useAuth"

import { useFonts } from "expo-font"

import color from "../style/color"

import { useNavigation } from "@react-navigation/native"

export default () => {
  const navigation = useNavigation()
  const { updateDateState, updateDateOfBirth } = useAuth()

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
                  marginLeft: 10,
                  fontSize: 18,
                  fontFamily: "text"
                }}
              >
                My birth day
              </Text>
            </View>
            <TouchableOpacity
              onPress={updateDateOfBirth}
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
            <View
              style={{
                width: "100%",
                paddingHorizontal: 10,
                marginTop: 30
              }}
            >
              <View
                style={{
                  height: 45,
                  marginBottom: 30,
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
                  Select date of birth
                </Text>

                <DatePicker
                  style={{
                    width: "100%",
                  }}
                  date={updateDateState?.date}
                  mode="date"
                  placeholder="select date"
                  format="DD/MM/YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      right: -5,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      borderColor: "gray",
                      alignItems: "flex-start",
                      borderWidth: 0,
                      borderBottomWidth: 1,
                    },
                    placeholderText: {
                      fontSize: 16,
                      color: color.dark,
                      fontFamily: "text"
                    },
                    dateText: {
                      fontSize: 16,
                    }
                  }}
                  onDateChange={date => {
                    updateDateState?.setDate(date)
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
