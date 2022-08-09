import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'

import { useFonts } from 'expo-font'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import LikeReelsReply from '../LikeReelsReply'
import useAuth from '../../hooks/useAuth'
import { useNavigation, useRoute } from '@react-navigation/native'
import ReelsCommentReplyReply from '../ReelsCommentReplyReply'
import { Octicons } from '@expo/vector-icons'
import UserAvatar from './components/UserAvatar'
import UserInfo from './components/UserInfo'
import Reply from './components/Reply'

const ReelsCommentReplies = ({ comment, background }) => {
  const { user, showExpand } = useAuth()
  const [replies, setReplies] = useState([])

  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    const unsub = (() => {
      onSnapshot(query(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'replies'), orderBy('timestamp', 'asc')),
        snapshot =>
          setReplies(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              ...doc?.data()
            }))
          )
      )
    })()
    return unsub
  }, [user, db])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        marginTop: 10
      }}
    >
      <FlatList
        data={replies?.splice(0, 1)}
        keyExtractor={item => item?.id}
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
            <UserAvatar user={reply?.user?.id} />
            <View>
              <View
                style={{
                  marginLeft: 10,
                  backgroundColor: color.lightBorderColor,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <UserInfo user={reply?.user?.id} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                  }}
                >
                  <Reply user={reply?.reelComment?.user?.id} reply={reply?.reply} />
                </View>
              </View>
              {
                route.name != 'ReelsComment' &&
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
                  <LikeReelsReply reply={reply} />
                  <ReelsCommentReplyReply reply={reply} />
                </View>
              }

              {
                showExpand &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('ViewReelsComments', { comment, background })}
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
                      color: color.white
                    }}
                  >
                    {replies?.length} {replies?.length > 1 ? 'Replies' : 'Reply'}
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

export default ReelsCommentReplies
// for reels