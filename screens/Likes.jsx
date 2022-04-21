import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground
} from 'react-native'
import React, { useEffect, useState } from 'react'

import color from "../style/color"
import home from "../style/home"

import { useFonts } from 'expo-font'

import useAuth from '../hooks/useAuth'

import { useNavigation } from '@react-navigation/native'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import firebase from '../hooks/firebase'

import generateId from '../lib/generateId'

const Likes = () => {
  const {
    user,
    userProfile,
    likes,
    setLikes,
    profils,
    setProfiles
  } = useAuth()
  const navigation = useNavigation()

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
    , [user])

  const swipeRight = async (like) => {
    const needle = like.id
    const cardIndex = profils.findIndex(item => item.id === needle)

    if (!profils[cardIndex]) return

    const userSwiped = profils[cardIndex]

    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .collection("pendingSwipes")
      .doc(userSwiped.id)
      .get()
      .then(documentSnapShot => {
        if (documentSnapShot.exists) {
          // user ha matched with you before
          // create match

          firebase.firestore()
            .collection("users")
            .doc(user.uid)
            .collection("pendingSwipes")
            .doc(userSwiped.id)
            .set(userSwiped)

          // CREATE A MATCH
          firebase.firestore()
            .collection("matches")
            .doc(generateId(user.uid, userSwiped.id))
            .set({
              users: {
                [user.uid]: userProfile,
                [userSwiped.id]: userSwiped
              },
              usersMatched: [user.uid, userSwiped.id],
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })

          firebase.firestore()
            .collection("users")
            .doc(user.uid)
            .collection("pendingSwipes")
            .doc(userSwiped.id)
            .delete()
            .then(() => {
              navigation.navigate("Match", {
                userProfile,
                userSwiped
              })
            })

        } else {
          firebase.firestore()
            .collection("users")
            .doc(user.uid)
            .collection("pendingSwipes")
            .doc(userSwiped.id)
            .set(userSwiped)
        }
      })
  }

  const swipeLeft = async (like) => {
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .collection("pendingSwipes")
      .doc(like.id)
      .delete()

    firebase.firestore()
      .collection("users")
      .doc(like.id)
      .collection("swipes")
      .doc(user.uid)
      .delete()
  }

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: -10
          }}
        >
          <Image
            resizeMode="cover"
            style={{
              width: 30,
              height: 30,
              marginTop: 10,
              marginRight: 10
            }}
            source={require("../assets/logo.png")}
          />
          <Text
            style={{
              fontSize: 30,
              color: color.red,
              fontFamily: "logo"
            }}
          >
            Oymo
          </Text>
        </View>

        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <MaterialCommunityIcons name="bell" size={26} color={color.lightText} />
        </TouchableOpacity>
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
                key={index}
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
                    height: "100%",
                    position: "relative"
                  }}
                  source={{ uri: like.avatar[0] }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      position: "absolute",
                      zIndex: 1,
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      minHeight: 40,
                      paddingVertical: 10
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => swipeLeft(like)}
                      style={{
                        width: 35,
                        height: 35,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: color.white,
                        borderRadius: 50
                      }}
                    >
                      <MaterialCommunityIcons name='close' size={20} color={color.red} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => swipeRight(like)}
                      style={{
                        width: 35,
                        height: 35,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: color.white,
                        borderRadius: 50
                      }}
                    >
                      <MaterialCommunityIcons name='heart' size={20} color={color.lightGreen} />
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            )
          })
        }
      </View>
    </SafeAreaView>
  )
}

export default Likes