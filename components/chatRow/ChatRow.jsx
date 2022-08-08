import React, { useState, useLayoutEffect } from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import getMatchedUserInfo from '../../lib/getMatchedUserInfo'

import { useNavigation } from '@react-navigation/native'

import { useFonts } from 'expo-font'
import { db } from '../../hooks/firebase'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import Avatar from './components/Avatar'
import Username from './components/Username'

const ChatRow = ({ matchDetails }) => {
  const { user, userProfile, theme } = useAuth()
  const navigation = useNavigation()

  const [matchedUserInfo, setMatchedUserInfo] = useState({})
  const [lastMessage, setLastMessage] = useState('')
  const [unreadMessage, setUnreadMessage] = useState([])

  useLayoutEffect(() => {
    (() => {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails?.users, userProfile?.id))
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
              snapshot?.docs[0]?.data()?.mediaType == 'video' ?
                `${snapshot?.docs[0]?.data()?.username != userProfile?.username ? snapshot?.docs[0]?.data().username : 'You'} ${snapshot?.docs[0]?.data()?.username == userProfile?.username ? 'sent a video' : 'Sent you a video'}...` :
              snapshot?.docs[0]?.data()?.mediaType == 'image' ?
                `${snapshot?.docs[0]?.data()?.username != userProfile?.username ? snapshot?.docs[0]?.data().username : 'You'} ${snapshot?.docs[0]?.data()?.username == userProfile?.username ? 'sent an image' : 'Sent you an image'}...` :
                snapshot?.docs[0]?.data()?.message || snapshot?.docs[0]?.data()?.caption
          )
      )
    })()
  }, [matchDetails, db])

  useLayoutEffect(() => {
    (async () => {
      onSnapshot(query(collection(db, 'matches', matchDetails?.id, 'messages'),
        where('userId', '!=', userProfile?.id),
        where('seen', '==', false)
      ),
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
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
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
        backgroundColor: theme == 'dark' ? color.black : color.white,
        borderRadius: 12,
        paddingHorizontal: 5
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
            <Avatar user={matchedUserInfo?.id} />
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
          <Username user={matchedUserInfo?.id} />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: theme == 'light' ? color.dark : color.white,
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