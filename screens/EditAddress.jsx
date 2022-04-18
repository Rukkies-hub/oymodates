import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput
} from 'react-native'
import React, { useState } from 'react'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import editProfile from '../style/editProfile'

import useAuth from "../hooks/useAuth"

import { useFonts } from 'expo-font'

import color from '../style/color'

import Constants from 'expo-constants'
import * as Location from 'expo-location'

const EditAddress = ({ navigation }) => {
  const { updateAddressState, updateAddress } = useAuth()

  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const getLocation = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
      )
      return
    }
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    const address = await Location.reverseGeocodeAsync(location.coords)
    setLocation(location)
    updateAddressState.setAddress(...address)

    console.log(location)
  }

  let text = 'Waiting..'
  if (errorMsg)
    text = errorMsg
  else if (location)
    text = JSON.stringify(location)

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={editProfile.container}>
      <Bar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              height: 45
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 10,
                  fontFamily: "text"
                }}
              >
                Location
              </Text>
            </View>
            <TouchableOpacity
              onPress={updateAddress}
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <MaterialCommunityIcons name="check" color={color.dark} size={24} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: color.white,
              flex: 1,
              justifyContent: "center"
            }}
          >
            <View style={editProfile.form}>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  minHeight: 50,
                  borderWidth: 1,
                  borderColor: color.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                }}
              >
                {
                  updateAddressState.address == null ?
                    <Text
                      style={{
                        fontFamily: "text"
                      }}
                    >
                      Waiting...
                    </Text>
                    : <Text
                      style={{
                        fontFamily: "text"
                      }}
                    >
                      {updateAddressState.address?.subregion}, {updateAddressState.address?.country}
                    </Text>
                }
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={getLocation}
                  style={{
                    width: "48%",
                    height: 50,
                    backgroundColor: color.offWhite,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    fontFamily: "text"
                  }}
                >
                  <Text style={{ color: color.dark, fontSize: 18 }}>Get location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={updateAddress}
                  style={{
                    width: "48%",
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: color.red,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    fontFamily: "text"
                  }}
                >
                  <Text style={{ color: color.white, fontSize: 18, marginLeft: 10 }}>Update</Text>
                </TouchableOpacity>
              </View>
              {/* <View style={editProfile.inputField}>
                <Text
                  style={{
                    fontSize: 12,
                    color: color.labelColor,
                    fontFamily: "text"
                  }}
                >
                  Location
                </Text>
                <TextInput
                  autoFocus
                  placeholder="Your current location"
                  value={updateAddressState.address}
                  onChangeText={updateAddressState.setAddress}
                  style={{
                    fontFamily: "text"
                  }}
                />
              </View> */}
            </View>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default EditAddress