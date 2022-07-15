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

  return (
    matches?.length > 0 ? (
      <SwipeListView
        data={matches}
        keyExtractor={item => item?.id}
        style={{
          marginHorizontal: 10
        }}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
        renderHiddenItem={({ item }) => (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 15,
            }}
          >
            <TouchableOpacity
              onPress={() => console.log(item)}
              style={
                [{
                  alignItems: 'center',
                  bottom: 0,
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 0,
                  width: 45,
                  height: 45,
                  borderRadius: 12
                }, {
                  backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                  right: 20,
                }]
              }
            >
              <Feather name="trash-2" size={20} color={color.red} />
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-50}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
      />
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black,
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