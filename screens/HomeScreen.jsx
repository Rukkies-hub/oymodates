import { SafeAreaView, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'

import firebase from "../hooks/firebase"

import useAuth from "../hooks/useAuth"
import Bar from "./StatusBar"

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Swiper from "react-native-deck-swiper"

import home from "../style/home"

import generateId from '../lib/generateId'

import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation()

  const swipeRef = useRef(null)

  const { user, userProfile } = useAuth()

  const [profils, setProfiles] = useState([])

  useEffect(() => {
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.data().avatar == "")
          navigation.navigate("EditProfile")
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })

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
        .catch(error => {
          console.log(error)
        })
    }

    fetchUsers()
  }, [])

  const swipeLeft = async (cardIndex) => {
    if (!profils[cardIndex]) return

    const userSwiped = profils[cardIndex]
    console.log(`You swiped PASS on ${userSwiped.username}`)
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
          console.log(`Hooray, You MATCHED with ${userSwiped.username}`)

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
          console.log(`You SWIPED on ${userSwiped.username}`)

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
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image style={{ height: 40, width: 100 }} source={require('../assets/logo.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center"
        }} onPress={() => navigation.navigate("Chat")}>
          <SimpleLineIcons name="bubble" color="rgba(0,0,0,0.6)" size={20} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: -6 }}>
        {profils.length >= 1 ? (
          <Swiper
            ref={swipeRef}
            containerStyle={{ backgroundColor: "transparent" }}
            cards={profils}
            stackSize={5}
            cardIndex={0}
            verticalSwipe={false}
            animateCardOpacity
            onSwipedLeft={(cardIndex) => {
              swipeLeft(cardIndex)
            }}
            onSwipedRight={(cardIndex) => {
              swipeRight(cardIndex)
            }}
            backgroundColor={"#4fd0e9"}
            renderCard={card => card ? (
              <View key={card.id} style={{
                backgroundColor: "#fff",
                height: 500,
                width: "100%",
                borderRadius: 24,
                position: "relative"
              }}>
                <Image style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  borderRadius: 24,
                  position: "absolute",
                  top: 0,
                  left: 0
                }} source={{ uri: card.avatar }} />

                <View style={{
                  backgroundColor: "#fff",
                  width: "100%", height: 60,
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  borderBottomRightRadius: 24,
                  borderBottomLeftRadius: 24,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.29,
                  shadowRadius: 4.65,

                  elevation: 7,
                }}>
                  <Text style={{ fontSize: 20, fontWeight: "600" }}>{card.username}</Text>
                  <Text>{card.job}</Text>
                </View>
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

      {
        profils.length >= 1 ? (
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => swipeRef.current.swipeLeft()}
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                width: 60,
                height: 60,
                backgroundColor: "rgba(255,71,87, 0.2)"
              }}>
              <MaterialCommunityIcons name="close" color="#FF4757" size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => swipeRef.current.swipeRight()}
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                width: 60,
                height: 60,
                backgroundColor: "rgba(70,201,58, 0.2)"
              }}>
              <MaterialCommunityIcons name="heart" color="#46C93A" size={32} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ display: "none" }}></View>
        )
      }

    </SafeAreaView>
  )
}

export default HomeScreen