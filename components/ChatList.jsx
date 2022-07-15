import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'

import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import ChatRow from './ChatRow'

import { SwipeListView } from 'react-native-swipe-list-view'

import { Feather } from '@expo/vector-icons'

const ChatList = () => {
  const { user, userProfile } = useAuth()
  const [matches, setMatches] = useState([])

  useEffect(() => {
    (() => {
      onSnapshot(query(collection(db, 'matches'),
        where('usersMatched', 'array-contains', user?.uid)),
        snapshot => setMatches(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        ))
    })()
  }, [user, db])

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey)
  }

  return (
    matches?.length > 0 ? (
      <FlatList
        style={{
          flex: 1,
          width: '100%',
          height: 70,
          paddingHorizontal: 10
        }}
        data={matches}
        keyExtractor={item => item?.id}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
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
          {
            userProfile?.theme == 'light' &&
            <Image
              source={require('../assets/rader.gif')}
              style={{
                position: 'absolute'
              }}
            />
          }
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
            color: userProfile?.theme == 'light' ? color.lightText : color.white,
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