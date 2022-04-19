import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Switch,
  Pressable
} from 'react-native'
import React, { useState } from 'react'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import editProfile from '../style/editProfile'
import color from '../style/color'

import useAuth from "../hooks/useAuth"

import { useFonts } from 'expo-font'

import _const from "../style/const"

import { LinearGradient } from 'expo-linear-gradient'

import Slider from '@react-native-community/slider'

import firebase from "../hooks/firebase"

const AccountSettings = ({ navigation }) => {
  const {
    userProfile,
    logout,
    user,
    getUserProfile,
    isGlobal,
    setIsGlobal,
    distance,
    setDistance,
    onlyRange,
    setOnlyRange
  } = useAuth()

  const seeGlobal = () => {
    setIsGlobal((previousState) => !previousState)
    let global = !isGlobal

    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        global: global == true ? true : false
      })
      .then(() => {
        getUserProfile(user)
      })
  }

  const updateMaximumDistance = () => {
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        maximumDistance: distance
      })
      .then(() => {
        getUserProfile(user)
      })
  }

  const restrictDistance = () => {
    setOnlyRange((previousState) => !previousState)
    let restrict = !onlyRange

    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        range: restrict == true ? true : false
      })
      .then(() => {
        getUserProfile(user)
      })
  }

  const showOnlyMen = () => {
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        showMe: "male",
      })
      .then(() => {
        getUserProfile(user)
      })
  }

  const showOnlyWomen = () => {
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        showMe: "female"
      })
      .then(() => {
        getUserProfile(user)
      })
  }

  const showBoth = () => {
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        showMe: "both"
      })
      .then(() => {
        getUserProfile(user)
      })
  }

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
            onPress={() => navigation.navigate("OymoPlatinum")}
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
                marginRight: 10
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
                marginTop: 8
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
            onPress={() => navigation.navigate("OymoGold")}
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
                marginRight: 10
              }}
            >
              Oymo
            </Text>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[color.goldDark, color.gold, color.goldDark]}
              style={{
                paddingVertical: 4,
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                marginTop: 8
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
              marginTop: 10,
              flexDirection: "row",
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
                marginRight: 10
              }}
            >
              Oymo
            </Text>
            <View
              style={{
                backgroundColor: color.red,
                paddingVertical: 4,
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                marginTop: 8
              }}
            >
              <Text
                style={{
                  color: color.white
                }}
              >
                Plus
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              paddingHorizontal: 10,
              marginTop: 10
            }}
          >
            <Text
              style={{
                fontFamily: "text",
                color: color.red,
                fontSize: 16
              }}
            >
              Discovery Settings
            </Text>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                borderBottomWidth: 1,
                borderColor: color.borderColor
              }}
            >
              <Text
                style={{
                  fontFamily: "text",
                  color: color.lightText
                }}
              >
                Global
              </Text>
              <Switch
                trackColor={{ false: color.borderColor, true: color.offWhite }}
                thumbColor={isGlobal ? color.red : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={seeGlobal}
                value={isGlobal}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "text"
                }}
              >
                Maximum Distance
              </Text>

              <Text
                style={{
                  fontFamily: "text"
                }}
              >
                {distance}<Text style={{ fontSize: 12 }}>mi</Text>
              </Text>
            </View>
            <Slider
              style={{
                width: "100%",
                height: 40
              }}
              step={1}
              value={distance}
              onValueChange={value => setDistance(value)}
              onSlidingComplete={updateMaximumDistance}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={color.red}
              maximumTrackTintColor={color.offWhite}
              thumbTintColor={color.red}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "text"
                }}
              >
                Only show people in this range
              </Text>

              <Switch
                trackColor={{ false: color.borderColor, true: color.offWhite }}
                thumbColor={onlyRange ? color.red : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={restrictDistance}
                value={onlyRange}
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              marginTop: 20
            }}
          >
            <Text
              style={{
                fontFamily: "text"
              }}
            >
              Show Me
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={showOnlyMen}
                style={{
                  width: "30%",
                  height: 40,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: userProfile.showMe == "male" ? color.red : color.borderColor,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "text",
                    color: userProfile.showMe == "male" ? color.red : color.borderColor
                  }}
                >
                  Men
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={showOnlyWomen}
                style={{
                  width: "30%",
                  height: 40,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: userProfile.showMe == "female" ? color.red : color.borderColor,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "text",
                    color: userProfile.showMe == "female" ? color.red : color.borderColor
                  }}
                >
                  Women
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={showBoth}
                style={{
                  width: "30%",
                  height: 40,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: userProfile.showMe == "both" ? color.red : color.borderColor,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "text",
                    color: userProfile.showMe == "both" ? color.red : color.borderColor
                  }}
                >
                  Everyone
                </Text>
              </TouchableOpacity>
            </View>

            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "text",
                  color: color.lightText
                }}
              >
                Show me men
              </Text>

              <Switch
                trackColor={{ false: color.borderColor, true: color.offWhite }}
                thumbColor={showMeMen ? color.red : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={showOnlyMen}
                value={showMeMen}
              />
            </View> */}

            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "text",
                  color: color.lightText
                }}
              >
                Show me women
              </Text>

              <Switch
                trackColor={{ false: color.borderColor, true: color.offWhite }}
                thumbColor={showMeWomen ? color.red : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={showOnlyWomen}
                value={showMeWomen}
              />
            </View> */}

            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "text",
                  color: color.lightText
                }}
              >
                Show everyone
              </Text>

              <Switch
                trackColor={{ false: color.borderColor, true: color.offWhite }}
                thumbColor={showMeAll ? color.red : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={showBoth}
                value={showMeAll}
              />
            </View> */}
          </View>

          <View style={editProfile.form}>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("EditPassword")}
                style={{
                  backgroundColor: color.white,
                  width: '100%',
                  height: 50,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }} >
                <Text style={{ color: color.purple, fontSize: 18 }}>Reset password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={logout}
                style={{
                  backgroundColor: color.white,
                  width: '100%',
                  height: 50,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10
                }} >
                <Text style={{ color: color.red, fontSize: 18 }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default AccountSettings