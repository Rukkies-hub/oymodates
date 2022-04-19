import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LogBox,
  ImageBackground,
  ScrollView
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
    <View style={account.container}>
      <Bar />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          backgroundColor: color.white,
          borderRadius: 50
        }}
      >
        <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
      </TouchableOpacity>

      <ScrollView
        bounces={false}
        style={{
          flex: 1,
          paddingBottom: 10
        }}
      >
        <ImageBackground
          resizeMode="cover"
          style={{
            width: "100%",
            minHeight: 500,
            position: "relative"
          }}
          source={userProfile.avatar ? { uri: userProfile?.avatar[0] } : require('../assets/pph.jpg')}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "absolute",
              bottom: -20,
              right: 10
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("AccountSettings")}
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: color.red,
                borderRadius: 50
              }}
            >
              <MaterialCommunityIcons name='cog' color={color.white} size={22} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: color.red,
                borderRadius: 50,
                marginHorizontal: 10
              }}
            >
              <MaterialCommunityIcons name='pencil' color={color.white} size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: color.red,
                borderRadius: 50
              }}
            >
              <MaterialCommunityIcons name='shield' color={color.white} size={22} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View
          style={{
            paddingHorizontal: 10,
            marginTop: 10,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "900",
              marginTop: 20,
              fontFamily: "text",
              color: color.dark
            }}
          >
            {userProfile.name}
            {userProfile.date ? ", " : " "}
            {userProfile.date && moment().diff(moment(userProfile.date, "DD-MM-YYYY"), 'years')}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            paddingBottom: 10
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <MaterialCommunityIcons name="map-marker" color={color.labelColor} size={16} />
            <Text
              style={{
                fontFamily: "text",
                color: color.labelColor
              }}
            >
              {userProfile.address?.city}, {userProfile.address?.country}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: color.borderColor
          }}
        >
          <Text
            style={{
              fontFamily: "text"
            }}
          >
            About Me
          </Text>

          <Text
            style={{
              marginTop: 10,
              color: color.dark,
              fontFamily: "text"
            }}
          >
            {userProfile.about}
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 10
          }}
        >
          <Text
            style={{
              fontFamily: "text",
              color: color.dark
            }}
          >
            Passion
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 10
            }}
          >
            {
              userProfile.intrests.map(passion => {
                return (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: color.red,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 50,
                      marginRight: 10,
                      marginBottom: 10
                    }}
                  >
                    <Text
                      style={{
                        color: color.red
                      }}
                    >
                      {passion}
                    </Text>
                  </View>
                )
              })
            }
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Account