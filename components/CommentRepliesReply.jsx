import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'

import { collection, onSnapshot } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import color from '../style/color'

import { useFonts } from 'expo-font'

import { Octicons } from '@expo/vector-icons'
import LikeReply from './LikeReply'
import useAuth from '../hooks/useAuth'
import PostCommentReplyReply from './PostCommentReplyReply'

const CommentReplies = (props) => {
  const comments = props.comment
  const { userProfile } = useAuth()

  const [replies, setReplies] = useState([])

  useEffect(() =>
    (() => {
      onSnapshot(collection(db, 'posts', comments?.post?.id, 'comments', comments?.id, 'replies'),
        snapshot =>
          setReplies(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              ...doc?.data()
            }))
          )
      )
    })()
    , [])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        marginTop: 10
      }}
    >
      <FlatList
        data={replies.splice(0, 1)}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        renderItem={({ item: reply }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: 10
            }}
          >
            <Image
              source={{ uri: reply?.user?.photoURL }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
              }}
            />
            <View>
              <View
                style={{
                  marginLeft: 10,
                  backgroundColor: userProfile?.theme == 'light' ? color.offWhite : userProfile?.theme == 'dark' ? color.lightText : color.dark,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: userProfile?.theme == 'light' ? color.dark : color.white,
                    fontFamily: 'text',
                    fontSize: 13
                  }}
                >
                  {reply?.user?.displayName}
                </Text>
                <Text
                  style={{
                    color: userProfile?.theme == 'light' ? color.dark : color.white
                  }}
                >
                  {reply?.reply}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 10,
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <LikeReply reply={reply} />
                <PostCommentReplyReply comment={reply} />
              </View>
            </View>
          </View>
        )}
      />
      {
        replies?.length > 1 &&
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Octicons name='reply' size={18} color={color.lightText} />
          <Text
            style={{
              fontFamily: 'text',
              marginLeft: 5,
              fontSize: 14
            }}
          >
            {replies?.length} Replies
          </Text>
        </TouchableOpacity>
      }
    </View>
  )
}

export default CommentReplies