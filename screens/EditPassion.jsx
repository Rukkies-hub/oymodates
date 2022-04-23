import React, { useState, useEffect } from "react"

import {
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import useAuth from "../hooks/useAuth"

import { useFonts } from "expo-font"

import color from "../style/color"

import firebase from "../hooks/firebase"

import { useNavigation } from "@react-navigation/native"

const intrestsList = [
  "karaoke",
  "cycling",
  "swimming",
  "cat lover",
  "dog lover",
  "environmentalism",
  "running",
  "outdoors",
  "trivia",
  "grap a drink",
  "museum",
  "gammer",
  "soccer",
  "netflix",
  "sports",
  "working out",
  "comedy",
  "spirituality",
  "board games",
  "cooking",
  "wine",
  "foodie",
  "hiking",
  "politics",
  "writer",
  "travel",
  "golf",
  "reading",
  "movies",
  "athlete",
  "baking",
  "plant-based",
  "vlogging",
  "gardening",
  "fishing",
  "art",
  "brunch",
  "climbing",
  "tea",
  "walking",
  "blogging",
  "volunteering",
  "astrology",
  "yoga",
  "instagram",
  "language exchange",
  "surfing",
  "craft beer",
  "shopping",
  "DIY",
  "dancing",
  "disney",
  "fashion",
  "music",
  "photography",
  "picnicking",
  "coffie"
]

export default () => {
  const navigation = useNavigation()
  const { user, getUserProfile, userProfile } = useAuth()
  const [intrests, setIntrests] = useState([])
  const [intrestsLoading, setIntrestsLoading] = useState(false)

  useEffect(() => {
    if (userProfile?.intrests?.length)
      setIntrests(userProfile?.intrests)
  }, [user, userProfile])

  const updateIntrests = () => {
    if (intrests?.length) {
      setIntrestsLoading(true)
      firebase.firestore()
        .collection("users")
        .doc(user?.uid)
        .update({
          intrests
        })
        .then(() => {
          getUserProfile(user)
          setIntrestsLoading(false)
          navigation.goBack()
        })
        .catch(() => setOccupationLoading(false))
    }
  }

  const [loaded] = useFonts({
    header: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf"),
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar />
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
            <MaterialCommunityIcons name="chevron-left" color={color.dark} size={30} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              marginLeft: 20,
              fontFamily: "text"
            }}
          >
            Your passion
          </Text>
        </View>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            fontSize: 25,
            color: color.dark,
            fontFamily: "header"
          }}
        >
          What are your passions
          {
            intrests?.length && <Text>[{intrests?.length}/5]</Text>
          }
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          paddingHorizontal: 10,
          marginTop: 30
        }}
      >
        <ScrollView
          style={{
            maxHeight: 600,
            minHeight: 400,
            marginBottom: 20
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }}
          >
            {
              intrestsList?.map((pashion, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (intrests?.includes(pashion))
                        setIntrests(intrests?.filter(item => item !== pashion))
                      else if (intrests?.length <= 4)
                        setIntrests(oldArray => [...oldArray, pashion])
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderWidth: 2,
                      borderRadius: 50,
                      borderColor: intrests?.includes(pashion) ? color.red : color.borderColor,
                      marginBottom: 10,
                      marginRight: 10
                    }}
                  >
                    <Text
                      style={{
                        color: intrests?.includes(pashion) ? color.red : color.lightText,
                        fontSize: 12,
                        fontFamily: "header",
                        textTransform: "capitalize"
                      }}
                    >
                      {pashion}
                    </Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={updateIntrests}
          style={{
            backgroundColor: color.red,
            height: 50,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {
            intrestsLoading ?
              <ActivityIndicator size="small" color={color.white} />
              :
              <Text
                style={{
                  color: color.white,
                  fontSize: 18,
                  fontFamily: "header"
                }}
              >
                Update pashion
              </Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
