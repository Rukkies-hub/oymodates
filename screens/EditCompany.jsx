import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import editProfile from '../style/editProfile'

import useAuth from "../hooks/useAuth"
import color from '../style/color'

const EditCompany = ({ navigation }) => {
  const { updateCompanyState, updateCompany } = useAuth()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={editProfile.container}>
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
                <SimpleLineIcons name="arrow-left" color={color.dark} size={20} />
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
            <View style={editProfile.form}>
              <View style={editProfile.inputField}>
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
                  value={updateCompanyState.company}
                  onChangeText={updateCompanyState.setCompany}
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