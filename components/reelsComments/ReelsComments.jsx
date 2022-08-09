import React, { useEffect, useLayoutEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Dimensions,
  TouchableOpacity
} from 'react-native'

import { collection, onSnapshot } from 'firebase/firestore'

import { db } from '../../hooks/firebase'

import color from '../../style/color'

import { useFonts } from 'expo-font'
import LikeReelsComment from '../LikeReelsComment'
import ReelsCommentReplies from '../reelsCommentReplies/ReelsCommentReplies'
import ReelsCommentReply from '../ReelsCommentReply'
import UserAvatar from './components/UserAvatar'
import UserInfo from './components/UserInfo'
import useAuth from '../../hooks/useAuth'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Octicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const ReelsComments = ({ reel, background }) => {
  const { user } = useAuth()
  const route = useRoute()
  const navigation = useNavigation()

  const [comments, setComments] = useState([])

  useLayoutEffect(() => {
    const unsub = (() => {
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
    return unsub
  }, [user])

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
        showsVerticalScrollIndicator={false}
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
                maxWidth: width - 40,
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
                  <LikeReelsComment comment={comment} reelId={reel?.id} />

                  <ReelsCommentReply comment={comment} />
                </View>

                {
                  route.name != 'ReelsComment' &&
                  <ReelsCommentReplies comment={comment} background={background} />
                }
                {
                  comment?.repliesCount >= 1 &&
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ViewReelsComments', { comment, background })}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginTop: 5,
                      marginBottom: 10
                    }}
                  >
                    <Octicons name='reply' size={18} color={color.white} />
                    <Text
                      style={{
                        fontFamily: 'text',
                        marginLeft: 5,
                        fontSize: 14,
                        color: color.white
                      }}
                    >
                        {comment?.repliesCount} {comment?.repliesCount <= 1 ? 'Reply' : 'Replies' }
                    </Text>
                  </TouchableOpacity>
                }
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