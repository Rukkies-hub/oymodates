import { View, Text, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import firebase from '../hooks/firebase'

import useAuth from "../hooks/useAuth"

import ChatRow from './ChatRow'

const ChatList = () => {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])

  useEffect(() =>
    firebase.firestore()
      .collection("matches")
      .where("usersMatched", "array-contains", user.uid)
      .onSnapshot(snapshot => {
        setMatches(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      })
    , [user])

  return (
    matches.length > 0 ? (
      <FlatList
        style={{ flex: 1, height: 70, paddingHorizontal: 10 }}
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />
    ) : (
      <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 24 }}>No matches at the moment</Text>
      </View>
    )
  )
}

export default ChatList