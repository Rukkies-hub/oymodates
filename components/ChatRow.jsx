import React, { useEffect, useState } from "react"

import { View, Text, Pressable, Image } from "react-native"

import getMatchedUserInfo from "../lib/getMatchedUserInfo"

import { useNavigation } from "@react-navigation/native"

import useAuth from "../hooks/useAuth"

import firebase from "../hooks/firebase"

import { useFonts } from "expo-font"

import color from "../style/color"

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation()
  const { user } = useAuth()

  const [matchedUserInfo, setMatchedUserInfo] = useState({})
  const [lastMessage, setLastMessage] = useState("")

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails?.users, user.uid))
  }, [matchDetails, user])

  useEffect(() =>
    firebase.firestore()
      .collection("matches")
      .doc(matchDetails.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(1)
      .onSnapshot(snapshot => setLastMessage(snapshot?.docs[0]?.data()?.message))
    , [matchDetails, firebase.collection])

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <Pressable
      onPress={() => navigation.navigate("MessageScreen", {
        matchDetails
      })}
      style={{
        height: 65,
        borderBottomWidth: .3,
        borderBottomColor: color.borderColor,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        {
          matchedUserInfo &&
          <Image
            style={{ width: 45, height: 45, borderRadius: 50 }}
            source={{ uri: matchedUserInfo?.avatar[0] }}
          />
        }
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "text",
              textTransform: "capitalize"
            }}
          >
            {matchedUserInfo?.username}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: color.lightText,
              fontFamily: "text"
            }}
          >
            {lastMessage || "Say Hi!"}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default ChatRow