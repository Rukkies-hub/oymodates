import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import editProfile from '../style/editProfile'

import Bar from "./StatusBar"

import useAuth from "../hooks/useAuth"

const EditProfile = ({ navigation }) => {
  const { userProfile, user, pickImage } = useAuth()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={editProfile.container}>
      <Bar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={editProfile.header}>
            <View style={editProfile.left}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SimpleLineIcons name="arrow-left" color="rgba(0,0,0,0.8)" size={20} />
              </TouchableOpacity>
              <Text style={editProfile.headText}>Edit profile</Text>
            </View>
          </View>
          <View style={editProfile.avatar}>
            <Image
              style={editProfile.avatarImage}
              source={userProfile.avatar ? { uri: userProfile.avatar } : require('../assets/pph.jpg') }
            />
            <TouchableOpacity style={editProfile.changeProfilePhoto} onPress={pickImage}>
              <Text style={editProfile.changeProfilePhotoText}>Change profile photo</Text>
            </TouchableOpacity>
          </View>

          <View style={editProfile.form}>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Username</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditUsername")} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.username}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Name</Text>
              <TouchableWithoutFeedback style={editProfile.input} onPress={() => navigation.navigate("EditName")}>
                <Text style={editProfile.inputText}>{userProfile.name}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.bioInputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Bio</Text>
              <TouchableWithoutFeedback style={editProfile.input} onPress={() => navigation.navigate("EditBio")}>
                <Text style={editProfile.inputText}>{userProfile.bio}</Text>
              </TouchableWithoutFeedback>
            </View>

            <View>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditPersonalInformation")}>
                <Text style={{ color: "#4169e1" }}>Edit personal information</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default EditProfile