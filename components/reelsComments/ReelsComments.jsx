import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Keyboard,
  TouchableOpacity
} from 'react-native'

import { collection, onSnapshot } from 'firebase/firestore'

import { db } from '../../hooks/firebase'

import color from '../../style/color'

import { useFonts } from 'expo-font'
import LikeReelsComment from '../LikeReelsComment'
import ReelsCommentReplies from '../ReelsCommentReplies'
import ReelsCommentReply from '../ReelsCommentReply'
import UserAvatar from './components/UserAvatar'
import UserInfo from './components/UserInfo'

const ReelsComments = ({ reel, background }) => {
  const [comments, setComments] = useState([])

  useEffect(() => {
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
  }, [db])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
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
            <UserAvatar user={comment?.user?.id} />

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
                <UserInfo user={comment?.user?.id} />

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
// for reels