import React, { useState, useLayoutEffect } from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

import { useNavigation } from '@react-navigation/native'

import { useFonts } from 'expo-font'
import { db } from '../hooks/firebase'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'

const ChatRow = ({ matchDetails }) => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()

  const [matchedUserInfo, setMatchedUserInfo] = useState({})
  const [lastMessage, setLastMessage] = useState('')
  const [unreadMessage, setUnreadMessage] = useState([])

  useLayoutEffect(() => {
    (() => {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails?.users, user?.uid == undefined ? user?.user?.uid : user?.uid))
    })()
  }, [matchDetails, user])

  useLayoutEffect(() => {
    (() => {
      onSnapshot(query(collection(db, 'matches', matchDetails?.id, 'messages'),
        orderBy('timestamp', 'desc')),
        limit(1),
        snapshot =>
          setLastMessage(
            snapshot?.docs[0]?.data()?.voiceNote ?
              `${matchedUserInfo?.username} Sent you a voice note...` :
              snapshot?.docs[0]?.data()?.message || snapshot?.docs[0]?.data()?.caption
          )
      )
    })()
  }, [matchDetails, db])

  useLayoutEffect(() => {
    (async () => {
      onSnapshot(query(collection(db, 'matches', matchDetails?.id, 'messages'),
        where('seen', '==', false)),
        snapshot => {
          setUnreadMessage(
            snapshot?.docs?.map(doc => ({
              id: doc?.id
            }))
          )
        })
    })()
  }, [db])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('Message', {
          matchDetails
        })
      }
      style={{
        height: 65,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
        borderRadius: 12
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            position: 'relative'
          }}
        >
          <View
            style={{
              borderWidth: unreadMessage?.length > 0 ? 2 : 0,
              borderColor: unreadMessage?.length > 0 ? color.red : null,
              borderRadius: 100
            }}
          >
            <Image
              style={{ width: 45, height: 45, borderRadius: 50 }}
              source={{ uri: matchedUserInfo?.photoURL }}
            />
          </View>
          {
            unreadMessage?.length > 0 &&
            <View
              style={{
                backgroundColor: color.red,
                paddingHorizontal: 5,
                borderRadius: 50,
                position: 'absolute',
                right: 0,
                bottom: 0
              }}
            >
              <Text
                style={{
                  color: color.white,
                  fontSize: 12
                }}
              >
                {unreadMessage?.length}
              </Text>
            </View>
          }
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontFamily: 'text',
              color: userProfile?.theme == 'light' ? color.dark : color.white
            }}
          >
            {matchedUserInfo?.username}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: userProfile?.theme == 'light' ? color.dark : color.white,
              fontFamily: 'text'
            }}
          >
            {lastMessage || 'Say Hi!'}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default ChatRow
// in use