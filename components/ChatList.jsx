import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'

import { View, Text, FlatList, Image } from 'react-native'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import ChatRow from './ChatRow'

const ChatList = () => {
  const { user, userProfile } = useAuth()
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
          backgroundColor: color.white,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('../assets/rader.gif')}
            style={{
              position: 'absolute'
            }}
          />
          <Image
            source={{ uri: userProfile?.photoURL || user?.photoURL }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100
            }}
          />
        </View>

        <Text
          style={{
            fontFamily: 'text',
            color: color.lightText,
            marginTop: 50
          }}
        >
          No matches at the moment
        </Text>
      </View>
    )
  )
}

export default ChatList