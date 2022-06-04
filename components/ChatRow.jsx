import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import getMatchedUserInfo from "../lib/getMatchedUserInfo"

import { useNavigation } from "@react-navigation/native"

import { useFonts } from "expo-font"
import { db } from '../hooks/firebase'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'

const ChatRow = ({ matchDetails }) => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()

  const [matchedUserInfo, setMatchedUserInfo] = useState({})
  const [lastMessage, setLastMessage] = useState("")

  useEffect(() =>
    setMatchedUserInfo(getMatchedUserInfo(matchDetails?.users, user.uid))
    , [matchDetails, user])

  useEffect(() =>
    onSnapshot(query(collection(db, 'matches', matchDetails.id, 'messages'),
      orderBy('timestamp', 'desc')),
      limit(1),
      snapshot => setLastMessage(snapshot.docs[0]?.data()?.message))
    , [matchDetails, db])

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails
        })
      }
      style={{
        height: 65,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Image
          style={{ width: 45, height: 45, borderRadius: 50 }}
          source={{ uri: matchedUserInfo?.photoURL }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "text",
              color: userProfile?.appMode != 'light' ? color.dark : color.white
            }}
          >
            {matchedUserInfo?.username}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: userProfile?.appMode != 'light' ? color.dark : color.white,
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