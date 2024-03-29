import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useLayoutEffect } from 'react'

import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import ChatRow from './chatRow/ChatRow'

import { SwipeListView } from 'react-native-swipe-list-view'

import { Feather } from '@expo/vector-icons'

import LoadingIndicator from './LoadingIndicator'

const ChatList = () => {
  const {
    user,
    userProfile,
    matches,
    setMatches,
    matchesFilter,
    setMatchesFilter,
    theme
  } = useAuth()

  useEffect(() => {
    return () => {
      fetchMatches()
    }
  }, [])

  useLayoutEffect(() =>
    fetchMatches()
    , [user, db])

  const fetchMatches = () => {
    const unsub = onSnapshot(query(collection(db, 'matches'),
      where('usersMatched', 'array-contains', userProfile?.id),
      orderBy('timestamp', 'desc')
    ),
      snapshot => {
        setMatches(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
        setMatchesFilter(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
      }
    )
    return unsub
  }

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey)
  }

  const renderHiddenItem = ({ item }) => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
      }}
    >
      <TouchableOpacity
        style={
          [{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 10,
            bottom: 0,
            width: 45,
            height: 45,
            borderRadius: 12,
          }, {
            backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
            right: 20,
          }]
        }
      >
        <Feather name='trash-2' size={20} color={color.red} />
      </TouchableOpacity>
    </View >
  )

  return (
    matches?.length > 0 ? (
      <FlatList
        data={matchesFilter}
        keyExtractor={item => item?.id}
        style={{
          flex: 1,
          height: 70,
          paddingHorizontal: 5
        }}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />
      // <SwipeListView
      //   data={matchesFilter}
      //   keyExtractor={item => item?.id}
      //   style={{
      //     flex: 1,
      //     height: 70,
      //     paddingHorizontal: 5
      //   }}
      //   renderItem={({ item }) => <ChatRow matchDetails={item} />}
      //   renderHiddenItem={renderHiddenItem}
      //   rightOpenValue={-90}
      //   previewRowKey={'0'}
      //   previewOpenValue={-40}
      //   previewOpenDelay={3000}
      //   onRowDidOpen={onRowDidOpen}
      // />
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: theme == 'dark' ? color.black : color.white,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <LoadingIndicator size={50} theme={theme} />
      </View>
    )
  )
}

export default ChatList
// in use