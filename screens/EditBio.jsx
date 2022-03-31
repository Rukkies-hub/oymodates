import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import editProfile from '../style/editProfile'

import useAuth from "../hooks/useAuth"

const EditBio = ({ navigation }) => {
  const [text, onChangeText] = React.useState("");
  const { bioState, updateBio } = useAuth()

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
              <Text style={editProfile.headText}>Bio</Text>
            </View>
            <TouchableOpacity onPress={updateBio}>
              <MaterialCommunityIcons name="check" color="#4169e1" size={24} />
            </TouchableOpacity>
          </View>

          <View style={editProfile.form}>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Bio</Text>
              <TextInput
                autoFocus
                maxLength={200}
                placeholder="Bio"
                value={bioState.bio}
                onChangeText={bioState.setBio}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default EditBio