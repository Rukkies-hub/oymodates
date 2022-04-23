import React, { useState } from "react"

import {
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import auth from "../style/auth"

import { StatusBar } from "expo-status-bar";

import useAuth from "../hooks/useAuth"

import { useFonts } from "expo-font"
import color from "../style/color"
import { useNavigation } from "@react-navigation/native";

export default () => {
  const navigation = useNavigation()
  const { signupState, signupUser } = useAuth()
  const [type, setType] = useState(true)

  const [loaded] = useFonts({
    logo: require("../assets/fonts/Pacifico/Pacifico-Regular.ttf"),
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={auth.container}>
        <StatusBar style="auto" />

        <View style={auth.form_view}>
          <View style={auth.head_texts}>
            <Text
              style={{
                fontSize: 48,
                color: color.dark,
                fontFamily: "logo"
              }}
            >
              Sign Up
            </Text>
          </View>

          <View style={auth.form_view_inputs}>
            <View style={auth.username_container}>
              <MaterialCommunityIcons name="account-outline" color={color.lightText} size={20} style={auth.email_icon} />
              <TextInput
                placeholder="Username"
                value={signupState.username}
                onChangeText={signupState.setUsername}
                style={
                  [
                    auth.form_view_inputs_input_1,
                    {
                      color: color.dark,
                      fontFamily: "text"
                    }
                  ]
                }
              />
            </View>

            <View style={auth.email_container}>
              <MaterialCommunityIcons name="at" color={color.lightText} size={20} style={auth.email_icon} />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={signupState.signupEmail}
                onChangeText={signupState.setSignupEmail}
                style={
                  [
                    auth.form_view_inputs_input_1,
                    {
                      color: color.dark,
                      fontFamily: "text"
                    }
                  ]
                }
              />
            </View>

            <View style={auth.password_container}>
              <MaterialCommunityIcons name="lock-outline" color={color.lightText} size={20} style={auth.lock_icon} />
              <TextInput
                secureTextEntry={type}
                placeholder="Password"
                value={signupState.signupPassword}
                onChangeText={signupState.setSignupPassword}
                style={
                  [
                    auth.form_view_inputs_input_2,
                    {
                      color: color.dark,
                      fontFamily: "text"
                    }
                  ]
                }
              />
              <TouchableOpacity onPress={() => {
                if (type == true) setType(false)
                else if (type == false) setType(true)
              }} style={auth.peek_password}>
                <MaterialCommunityIcons name={type == true ? "eye-outline" : "eye-off-outline"} color={color.lightText} size={20} style={auth.eye_icon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={signupUser} style={auth.signup_button}>
            {signupState.spiner ? (
              <ActivityIndicator size="small" color={color.white} />
            ) : (
              <Text
                style={
                  [
                    auth.signup_button_text,
                    {
                      fontFamily: "text"
                    }
                  ]
                }
              >
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <View style={auth.signin_link}>
            <Pressable onPress={() => navigation.navigate("LoginScreen")}>
              <Text
                style={
                  [
                    auth.signin_link_text,
                    {
                      fontFamily: "text",
                      color: color.lightText
                    }
                  ]
                }
              >
                Already have an account? Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
