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

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import colors from "../style/color"
import auth from "../style/auth"

import useAuth from "../hooks/useAuth"

const LoginScreen = ({ navigation }) => {
  const { signinState, signinUser } = useAuth()

  const [type, setType] = React.useState(true)

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
            <Text style={auth.head_texts_text_1}>Sign In</Text>
          </View>

          <View style={auth.form_view_inputs}>
            <View style={auth.email_container}>
              <SimpleLineIcons name="envelope" color="rgba(0,0,0,0.6)" size={20} style={auth.email_icon} />
              <TextInput
                placeholder="Email"
                value={signinState.signinEmail}
                onChangeText={signinState.setSigninEmail}
                style={auth.form_view_inputs_input_1}
              />
            </View>
            <View style={auth.password_container}>
              <SimpleLineIcons name="lock" color="rgba(0,0,0,0.6)" size={20} style={auth.lock_icon} />
              <TextInput
                secureTextEntry={type}
                placeholder="Password"
                value={signinState.signinPassword}
                onChangeText={signinState.setSigninPassword}
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

          <TouchableOpacity onPress={signinUser} style={auth.signup_button}>
            {signinState.spiner ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={auth.signup_button_text}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={auth.signin_link}>
            <Pressable onPress={() => navigation.navigate("SignupScreen")}>
              <Text style={auth.signin_link_text}>
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