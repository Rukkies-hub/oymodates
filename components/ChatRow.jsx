import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

import { useNavigation } from '@react-navigation/core'
import useAuth from '../hooks/useAuth'

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation()
  const { user } = useAuth()

  const [matchedUserInfo, setMatchedUserInfo] = useState()

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
  }, [matchDetails, user])

  console.log("matchedUserInfo: ", matchedUserInfo)

  return (
    <TouchableOpacity style={{
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
          <Text style={{ fontSize: 18, fontWeight: "600" }}>{matchedUserInfo.username }</Text>
          <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>Say Hi!!</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow