import { SafeAreaView, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'

import firebase from "../hooks/firebase"

import useAuth from "../hooks/useAuth"
import Bar from "./StatusBar"

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Swiper from "react-native-deck-swiper"

import home from "../style/home"

import generateId from '../lib/generateId'

import { useNavigation } from '@react-navigation/native'

import { LinearGradient } from 'expo-linear-gradient'
import color from '../style/color'

const HomeScreen = () => {
  const navigation = useNavigation()

  const swipeRef = useRef(null)

  const { user, userProfile, logout } = useAuth()

  useLayoutEffect(() => {
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.data()?.name || doc.data()?.avatar?.length < 1 || doc.data()?.location || doc.data()?.occupation)
          navigation.navigate("Setup")
      })
  }, [])

  const [profils, setProfiles] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const passes = await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("passes")
        .get()
        .then(snapshot => snapshot?.docs?.map(doc => doc.id))

      const swipes = await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("swipes")
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.id))


      const passedUserIds = passes.length > 0 ? passes : ['test']
      const swipedUserIds = swipes.length > 0 ? swipes : ['test']

      await firebase.firestore()
        .collection("users")
        .where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        .get()
        .then((snapshot) => {
          setProfiles(
            snapshot.docs
              .filter(doc => doc.id !== user.uid)
              .map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
          )
        })
    }

    fetchUsers()
  }, [])

  const swipeLeft = async (cardIndex) => {
    if (!profils[cardIndex]) return

    const userSwiped = profils[cardIndex]
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .collection("passes")
      .doc(userSwiped.id)
      .set(userSwiped)
  }

  const swipeRight = async (cardIndex) => {
    if (!profils[cardIndex]) return

    const userSwiped = profils[cardIndex]

    // // check if the user swiped on you...
    await firebase.firestore()
      .collection("users")
      .doc(userSwiped.id)
      .collection("swipes")
      .doc(user.uid)
      .get()
      .then(documentSnapShot => {
        if (documentSnapShot.exists) {
          // user ha matched with you before
          // create match

          firebase.firestore()
            .collection("users")
            .doc(user.uid)
            .collection("swipes")
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

          navigation.navigate("Match", {
            userProfile,
            userSwiped
          })
        } else {
          // User has swiped as first interaction between the two or didnt get swiped on...

          firebase.firestore()
            .collection("users")
            .doc(user.uid)
            .collection("swipes")
            .doc(userSwiped.id)
            .set(userSwiped)
        }
      })
  }

  return (
    <SafeAreaView style={home.container}>
      <Bar />
      <View style={home.header}>
        <Image style={{ height: 40, width: 100 }} source={require('../assets/logo.png')} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Account")}
          >
            {
              userProfile == null ?
                <ActivityIndicator size="small" color="rgba(0,0,0,0)" />
                : (userProfile.avatar?.length ?
                  <Image style={{ width: 30, height: 30, borderRadius: 50, marginTop: -3 }} source={{ uri: userProfile.avatar[0] }} />
                  : <SimpleLineIcons name="user" color="#000" size={22} />
                )
            }
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: -6 }}>
        {profils.length >= 1 ? (
          <Swiper
            ref={swipeRef}
            containerStyle={{ backgroundColor: "transparent" }}
            cards={profils}
            cardIndex={0}
            verticalSwipe={true}
            animateCardOpacity
            onSwipedLeft={(cardIndex) => {
              swipeLeft(cardIndex)
            }}
            onSwipedRight={(cardIndex) => {
              swipeRight(cardIndex)
            }}
            backgroundColor={"transparent"}
            renderCard={card => card ? (
              <View key={card.id}
                style={{
                  backgroundColor: "#fff",
                  height: 650,
                  marginTop: -30,
                  width: "100%",
                  borderRadius: 16,
                  position: "relative",
                  overflow: "hidden"
                }}>
                {/* <Image style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                }} source={{ uri: card.avatar[0] }} /> */}

                <LinearGradient
                  colors={['transparent', '#000']}
                  style={{
                    width: "100%",
                    minHeight: 60,
                    position: "absolute",
                    bottom: 0,
                    paddingHorizontal: 20,
                    paddingVertical: 10
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: 10
                    }}>
                    {card.username}
                  </Text>

                  <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        width: 40,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#fff"
                      }}>
                      <MaterialCommunityIcons name="refresh" color="#fff" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => swipeRef.current.swipeLeft()}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        width: 55,
                        height: 55,
                        borderWidth: 1,
                        borderColor: "#FF4757"
                      }}>
                      <MaterialCommunityIcons name="close" color="#FF4757" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        width: 40,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#4169e1"
                      }}>
                      <MaterialCommunityIcons name="star" color="#4169e1" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => swipeRef.current.swipeRight()}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        width: 55,
                        height: 55,
                        borderWidth: 1,
                        borderColor: "#46C93A"
                      }}>
                      <MaterialCommunityIcons name="heart" color="#46C93A" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => console.log(card)}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        width: 40,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#fff"
                      }}>
                      <MaterialCommunityIcons name="lightning-bolt" color="#fff" size={30} />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View style={{
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Image
                  style={{ width: 105, height: 105 }}
                  width={105}
                  height={105}
                  source={require("../assets/sad.png")} />
                <Text style={{ fontSize: 20, fontWeight: "600" }}>No more profiles</Text>
              </View>
            )}
          />
        ) : (
          <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <ActivityIndicator size="large" color="rgba(0,0,0,0.6)" />
          </View>
        )}
      </View>

    </SafeAreaView>
  )
}

export default HomeScreen