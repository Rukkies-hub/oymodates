import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import editProfile from '../style/editProfile'

import useAuth from "../hooks/useAuth"

const EditUsername = ({ navigation }) => {
  const { usernameState, updateUsername } = useAuth()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={editProfile.container}>
      <Bar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <View style={editProfile.header}>
            <View style={editProfile.left}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SimpleLineIcons name="arrow-left" color="rgba(0,0,0,0.8)" size={20} />
              </TouchableOpacity>
              <Text style={editProfile.headText}>Username</Text>
            </View>
            <TouchableOpacity onPress={updateUsername}>
              <MaterialCommunityIcons name="check" color="#4169e1" size={24} />
            </TouchableOpacity>
          </View>

          <View style={editProfile.form}>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Username</Text>
              <TextInput
                autoFocus
                placeholder="Username"
                value={usernameState.username}
                onChangeText={usernameState.onchangeUsername}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default EditUsername