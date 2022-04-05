import { View, Text, TouchableOpacity, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

import { useNavigation } from '@react-navigation/core'
import useAuth from '../hooks/useAuth'

import firebase from '../hooks/firebase'

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation()
  const { user } = useAuth()

  const [matchedUserInfo, setMatchedUserInfo] = useState({})
  const [lastMessage, setLastMessage] = useState("")
  const [unseenMessage, setUnseenMessage] = useState([])

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
  }, [matchDetails, user])

  useEffect(() =>
    firebase.firestore()
      .collection("matches")
      .doc(matchDetails.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(1)
      .onSnapshot(snapshot =>
        setLastMessage(snapshot.docs[0]?.data()?.message)
      )
    , [matchDetails, firebase.collection])

  return (
    <Pressable
      onPress={() => navigation.navigate("MessageScreen", {
        matchDetails
      })}
      style={{
        height: 65,
        borderBottomWidth: .3,
        borderBottomColor: "rgba(0,0,0,0.5)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <Image
          style={{ width: 45, height: 45, borderRadius: 50 }}
          source={{ uri: matchedUserInfo.avatar }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>{matchedUserInfo.username}</Text>
          <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>{lastMessage || "Say Hi!"}</Text>
        </View>
      </View>
    </Pressable>
  )
}

export default ChatRow