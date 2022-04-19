import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import color from "../style/color"
import home from "../style/home"

import { useFonts } from 'expo-font'

import firebase from "../hooks/firebase"
import useAuth from '../hooks/useAuth'

import { useNavigation } from '@react-navigation/native'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

const Likes = () => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()

  const swipeRef = useRef(null)

  const [likes, setLikes] = useState([])

  useEffect(() =>
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .collection("pendingSwipes")
      .onSnapshot(snapshot => {
        setLikes(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      })
    , [userProfile])

  const [loaded] = useFonts({
    logo: require("../assets/fonts/Pacifico/Pacifico-Regular.ttf"),
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <View style={home.header}>
        <Text
          style={{
            fontSize: 30,
            color: "#000",
            fontFamily: "logo"
          }}
        >
          Oymo
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Account")}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: color.transparent
            }}
          >
            {
              userProfile == null ?
                <ActivityIndicator size="small" color="rgba(0,0,0,0)" />
                : (userProfile.avatar?.length ?
                  <Image style={{ width: 35, height: 35, borderRadius: 50, marginTop: -3 }} source={{ uri: userProfile.avatar[0] }} />
                  : <SimpleLineIcons name="user" color="#000" size={22} />
                )
            }
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingHorizontal: 10
        }}
      >
        {
          likes.map((like, index) => {
            return (
              <View
                style={{
                  backgroundColor: color.white,
                  height: 200,
                  width: "45%",
                  borderRadius: 10,
                  overflow: "hidden"
                }}
              >
                <ImageBackground
                  blurRadius={userProfile.subscriptionPlans == "gold" ? 0 : userProfile.subscriptionPlans == "platinum" ? 0 : 50}
                  resizeMode="cover"
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%"
                  }}
                  source={{ uri: like.avatar[0] }}
                ></ImageBackground>
              </View>
            )
          })
        }
      </View>
    </SafeAreaView>
  )
}

export default Likes