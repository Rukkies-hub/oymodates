import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native'
import React from 'react'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import editProfile from '../style/editProfile'
import color from '../style/color'

import useAuth from "../hooks/useAuth"

import { useFonts } from 'expo-font'

import _const from "../style/const"

import { LinearGradient } from 'expo-linear-gradient'

const EditPersonalInformation = ({ navigation }) => {
  const { userProfile, logout } = useAuth()

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf"),
    logo: require("../assets/fonts/Pacifico/Pacifico-Regular.ttf")
  })

  if (!loaded)
    return null

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={editProfile.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={_const.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 18,
                fontFamily: "text"
              }}
            >
              Personal information
            </Text>
          </View>

          <TouchableOpacity
            style={{
              height: 90,
              width: "100%",
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 30,
              shadowColor: color.labelColor,
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.30,
              elevation: 13,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: color.dark,
                fontFamily: "logo",
                marginRight: 10,
                marginTop: -10
              }}
            >
              Oymo
            </Text>
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                backgroundColor: color.black,
              }}
            >
              <Text
                style={{
                  fontFamily: "text",
                  color: color.white
                }}
              >
                platinum
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 90,
              width: "100%",
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              marginTop: -20,
              borderRadius: 30,
              shadowColor: color.labelColor,
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.30,
              elevation: 13,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: color.dark,
                fontFamily: "logo",
                marginRight: 10,
                marginTop: -10
              }}
            >
              Oymo
            </Text>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[color.gold, color.white, color.gold]}
              style={{
                paddingVertical: 4,
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8
              }}
            >
              <Text
                style={{
                  fontFamily: "text"
                }}
              >
                Gold
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("OymoPlus")}
            style={{
              height: 90,
              width: "100%",
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              marginTop: -20,
              borderRadius: 30,
              shadowColor: color.labelColor,
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.30,
              elevation: 13,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: color.dark,
                fontFamily: "logo",
                marginRight: 10,
                marginTop: -10
              }}
            >
              Oymo
            </Text>
            <MaterialCommunityIcons name='plus' size={30} color={color.red} />
          </TouchableOpacity>

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