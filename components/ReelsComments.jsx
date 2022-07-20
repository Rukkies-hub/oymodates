import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Keyboard
} from 'react-native'

import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import color from '../style/color'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import LikeReelsComment from './LikeReelsComment'
import ReelsCommentReplies from './ReelsCommentReplies'
import ReelsCommentReply from './ReelsCommentReply'

const ReelsComments = ({ reel, background }) => {
  const { userProfile, user } = useAuth()

  const [comments, setComments] = useState([])
  const [height, setHeight] = useState(40)
  const [input, setInput] = useState('')

  useEffect(() =>
    (() => {
      onSnapshot(collection(db, 'reels', reel?.id, 'comments'),
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlatList
        data={comments}
        keyExtractor={item => item?.id}
        style={{
          flex: 1,
          marginHorizontal: 10
        }}
        renderItem={({ item: comment }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginBottom: 10
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
                    color: color.white,
                    fontSize: 14
                  }}
                >
                  {comment?.comment}
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 10
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
                  <LikeReelsComment comment={comment} />

                  <ReelsCommentReply comment={comment} />
                </View>

                <ReelsCommentReplies comment={comment} background={background} />
              </View>
            </View>
          </View>
        )}
      />
    </TouchableWithoutFeedback>
  )
}

export default ReelsComments