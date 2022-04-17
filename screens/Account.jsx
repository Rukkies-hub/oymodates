import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LogBox,
} from 'react-native'

import React, { useState, useEffect } from 'react'

import Bar from "./StatusBar"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import account from "../style/account"

import useAuth from "../hooks/useAuth"
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

import { useFonts } from 'expo-font'

import color from '../style/color'

import _const from '../style/const'

const Account = () => {
  const navigation = useNavigation()
  const { userProfile } = useAuth()

  useEffect(() =>
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested",
      "Setting a timer for a long period of time",
      "Uncaught Error in snapshot listener"
    ])
    , [])

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView style={account.container}>
      <Bar />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={_const.absoluteBackButton}
      >
        <MaterialCommunityIcons name='chevron-left' color="#000" size={30} />
      </TouchableOpacity>
      <View style={account.detail}>
        <View style={_const.centerItem}>
          <TouchableWithoutFeedback>
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 100
              }}
              source={userProfile.avatar ? { uri: userProfile?.avatar[0] } : require('../assets/pph.jpg')}
            />
          </TouchableWithoutFeedback>
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "900",
                marginTop: 20,
                fontFamily: "text"
              }}
            >
              {userProfile.name} {userProfile.date&& moment().diff(moment(userProfile.date, "DD-MM-YYYY"), 'years')}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: -40,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("EditPersonalInformation")}
          style={{
            width: 70,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: .3,
            borderRadius: 50,
            borderColor: color.borderColor
          }}
        >
          <MaterialCommunityIcons name='cog' color={color.dark} size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          style={{
            width: 70,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: .3,
            borderRadius: 50,
            borderColor: color.borderColor,
            marginTop: 100
          }}
        >
          <MaterialCommunityIcons name='pencil' color={color.dark} size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: .3,
            borderRadius: 50,
            borderColor: color.borderColor
          }}
        >
          <MaterialCommunityIcons name='shield' color={color.dark} size={22} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Account