import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React from 'react'

import SelectDropdown from 'react-native-select-dropdown'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import editProfile from '../style/editProfile'

import useAuth from "../hooks/useAuth"


const gender = ["Male", "Female"]

const EditGender = () => {
  const { updateGenderState, updateGender } = useAuth()

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
              <Text style={editProfile.headText}>Gender</Text>
            </View>
            <TouchableOpacity onPress={updateGender}>
              <MaterialCommunityIcons name="check" color="#4169e1" size={24} />
            </TouchableOpacity>
          </View>

          <View style={editProfile.form}>
            <View style={{
              height: 45,
              marginBottom: 30,
              position: "relative"
            }} >
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Name</Text>
              <SelectDropdown
                data={gender}
                onSelect={(selectedItem, index) => {
                  updateGenderState.setGender(selectedItem)
                }}

                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}

                rowTextForSelection={(item, index) => {
                  return item
                }}

                buttonStyle={{
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0)",
                  borderBottomWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                }}

                buttonTextStyle={{
                  fontSize: 16,
                }}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView >
  )
}

export default EditGender