import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import color from '../style/color'

import { useFonts } from 'expo-font'

import { Octicons } from '@expo/vector-icons'
import LikeReply from './LikeReply'
import useAuth from '../hooks/useAuth'
import PostCommentReplyReply from './PostCommentReplyReply'
import AllPostCommentReplies from './AllPostCommentReplies'
import { useNavigation, useRoute } from '@react-navigation/native'

const CommentReplies = ({ comment, textColor, backgroundColor, showAll }) => {
  const { userProfile, showExpand, setShowExpand } = useAuth()
  const navigation = useNavigation()
  const route = useRoute()

  const [replies, setReplies] = useState([])

  useEffect(() =>
    (() => {
      onSnapshot(query(collection(db, 'posts', comment?.post?.id, 'comments', comment?.id, 'replies'), orderBy('timestamp', 'asc')),
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
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        marginTop: 10
      }}
    >
      <FlatList
        data={showAll ? replies : replies.length > 1 ? replies.splice(0, 1) : replies}
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
                  backgroundColor: backgroundColor || color.lightBorderColor,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: textColor || color.white,
                    fontFamily: 'text',
                    fontSize: 13
                  }}
                >
                  @{reply?.user?.username}
                </Text>
                <View
                  style={{
                    flexDirection: 'row'
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <Text
                      style={{
                        color: textColor || color.white,
                        fontFamily: 'boldText',
                        marginRight: 5
                      }}
                    >
                      @{reply?.postReply?.user?.username}
                    </Text>
                    <Text
                      style={{
                        color: textColor || color.white
                      }}
                    >
                      {reply?.reply}
                    </Text>
                  </View>
                </View>
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
                <LikeReply textColor={route.name == 'AddComment' ? color.white : userProfile?.theme == 'dark' ? color.white : color.dark} reply={reply} />
                <PostCommentReplyReply textColor={route.name == 'AddComment' ? color.white : userProfile?.theme == 'dark' ? color.white : color.dark} comment={reply} />
              </View>

              {
                showExpand &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('ViewPostComments', { comment })}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 10
                  }}
                >
                  <Octicons name='reply' size={18} color={color.white} />
                  <Text
                    style={{
                      fontFamily: 'text',
                      marginLeft: 5,
                      fontSize: 14,
                      color: textColor || color.white
                    }}
                  >
                    {1 + replies?.length} Replies
                  </Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default CommentReplies