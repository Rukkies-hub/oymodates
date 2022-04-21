import React from "react"
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import colors from "../style/color"
import auth from "../style/auth"

import useAuth from "../hooks/useAuth"

import { useFonts } from 'expo-font'
import color from "../style/color"

const LoginScreen = ({ navigation }) => {
  const { signinState, signinUser } = useAuth()
  const [type, setType] = React.useState(true)

  const [loaded] = useFonts({
    logo: require("../assets/fonts/Pacifico/Pacifico-Regular.ttf"),
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={auth.container}>
        <StatusBar
          animated={true}
          barStyle="dark-content"
          backgroundColor={colors.white}
        />
        <View style={auth.form_view}>
          <View style={auth.head_texts}>
            <Text
              style={{
                fontSize: 48,
                color: color.dark,
                fontFamily: "logo"
              }}
            >
              Sign In
            </Text>
          </View>

          <View style={auth.form_view_inputs}>
            <View style={auth.email_container}>
              <MaterialCommunityIcons name="at" color={color.lightText} size={20} style={auth.email_icon} />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={signinState.signinEmail}
                onChangeText={signinState.setSigninEmail}
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
              <MaterialCommunityIcons name="lock-outline" color={color.dark} size={20} style={auth.lock_icon} />
              <TextInput
                secureTextEntry={type}
                placeholder="Password"
                value={signinState.signinPassword}
                onChangeText={signinState.setSigninPassword}
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
                <MaterialCommunityIcons name={type == true ? 'eye-outline' : 'eye-off-outline'} color={color.lightText} size={20} style={auth.eye_icon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={signinUser} style={auth.signup_button}>
            {signinState.spiner ? (
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
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View style={auth.signin_link}>
            <Pressable onPress={() => navigation.navigate("SignupScreen")}>
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
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen