import React from 'react'

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
} from 'react-native'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import auth from "../style/auth"

import { StatusBar } from 'expo-status-bar';

import useAuth from "../hooks/useAuth"

import { useFonts } from 'expo-font'

const SignupScreen = ({ navigation }) => {
  const { signupState, signupUser } = useAuth()
  const [type, setType] = React.useState(true)

  const [loaded] = useFonts({
    logo: require("../assets/fonts/Pacifico/Pacifico-Regular.ttf")
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
                color: "#000",
                fontFamily: "logo"
              }}
            >
              Sign In</Text>
          </View>

          <View style={auth.form_view_inputs}>
            <View style={auth.username_container}>
              <SimpleLineIcons name="user" color="rgba(0,0,0,0.6)" size={20} style={auth.email_icon} />
              <TextInput
                placeholder="Username"
                value={signupState.username}
                onChangeText={signupState.setUsername}
                style={auth.form_view_inputs_input_1}
              />
            </View>

            <View style={auth.email_container}>
              <SimpleLineIcons name="envelope" color="rgba(0,0,0,0.6)" size={20} style={auth.email_icon} />
              <TextInput
                placeholder="Email"
                value={signupState.signupEmail}
                onChangeText={signupState.setSignupEmail}
                style={auth.form_view_inputs_input_1}
              />
            </View>

            <View style={auth.password_container}>
              <SimpleLineIcons name="lock" color="rgba(0,0,0,0.6)" size={20} style={auth.lock_icon} />
              <TextInput
                secureTextEntry={type}
                placeholder="Password"
                value={signupState.signupPassword}
                onChangeText={signupState.setSignupPassword}
                style={auth.form_view_inputs_input_2}
              />
              <TouchableOpacity onPress={() => {
                if (type == true) setType(false)
                else if (type == false) setType(true)
              }} style={auth.peek_password}>
                <MaterialCommunityIcons name={type == true ? 'eye-outline' : 'eye-off-outline'} color="rgba(0,0,0,0.5)" size={20} style={auth.eye_icon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={signupUser} style={auth.signup_button}>
            {signupState.spiner ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={auth.signup_button_text}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={auth.signin_link}>
            <Pressable onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={auth.signin_link_text}>
                Already have an account? Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default SignupScreen