import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Keyboard,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  UIManager,
} from 'react-native'

import { collection, onSnapshot } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import color from '../style/color'

import useAuth from '../hooks/useAuth'

import Likecomments from './Likecomments'
import { useFonts } from 'expo-font'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import CommentReplies from './CommentReplies'
import PostCommentReply from './PostCommentReply'

const Comments = ({ post }) => {
  const [comments, setComments] = useState([])

  useEffect(() =>
    (() => {
      onSnapshot(collection(db, 'posts', post?.id, 'comments'),
        snapshot =>
          setComments(
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
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        style={{
          flex: 1,
          paddingHorizontal: 10
        }}
        renderItem={({ item: comment }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginVertical: 10
            }}
          >
            <Image
              source={{ uri: comment?.user?.photoURL }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 50
              }}
            />
            <View
              style={{
                width: '100%',
                alignItems: 'flex-start'
              }}
            >
              <View
                style={{
                  marginLeft: 10,
                  backgroundColor: color.lightBorderColor,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    fontSize: 13
                  }}
                >
                  {comment?.user?.username}
                </Text>
                <Text
                  style={{
                    color: color.white
                  }}
                >
                  {comment?.comment}
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 10,
                  marginTop: 5
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 4
                  }}
                >
                  <Likecomments comment={comment} />

                  <PostCommentReply comment={comment} />
                </View>

                <CommentReplies comment={comment} />
              </View>
            </View>
          </View>
        )}
      />
    </TouchableWithoutFeedback>
  )
}

export default Comments