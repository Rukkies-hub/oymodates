import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React from 'react'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import editProfile from '../style/editProfile'
import color from '../style/color'

import useAuth from "../hooks/useAuth"

const EditPersonalInformation = ({ navigation }) => {
  const { userProfile, logout } = useAuth()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={editProfile.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={editProfile.header}>
            <View style={editProfile.left}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SimpleLineIcons name="arrow-left" color="rgba(0,0,0,0.8)" size={20} />
              </TouchableOpacity>
              <Text style={editProfile.headText}>Personal information</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", paddingHorizontal: 50, marginTop: 10 }}>
            <Text style={{ textAlign: "center" }}>Provide your personal information. This won't be part of your public profile</Text>
          </View>

          <View style={editProfile.form}>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Phone number</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditPhone")} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.phone}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Gender</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditGender")} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.gender}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Birthday</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditDateOfBirth')} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.date}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("EditPassword")}
                style={{
                  backgroundColor: color.purple,
                  width: '100%',
                  height: 50,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }} >
                <Text style={{ color: '#fff', fontSize: 18 }}>Reset password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={logout}
                style={{
                  backgroundColor: "#FF4757",
                  width: '100%',
                  height: 50,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10
                }} >
                <Text style={{ color: '#fff', fontSize: 18 }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default EditPersonalInformation