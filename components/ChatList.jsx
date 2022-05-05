import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'

import { View, Text, FlatList } from 'react-native'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'

import ChatRow from './ChatRow'

const ChatList = () => {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])

  useEffect(() =>
    onSnapshot(query(collection(db, 'matches'),
      where('usersMatched', 'array-contains', user.uid)),
      snapshot => setMatches(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      ))
    , [user])

  console.log('matches: ', matches)

  return (
    matches.length > 0 ? (
      <FlatList
        style={{
          flex: 1,
          width: "100%",
          height: 70,
          paddingHorizontal: 10
        }}
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text>No matches at the moment</Text>
      </View>
    )
  )
}

export default ChatList