import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { db } from '../../hooks/firebase'

import color from '../../style/color'

import { useFonts } from 'expo-font'

import { Octicons } from '@expo/vector-icons'
import LikeReelsReply from '../LikeReelsReply'
import useAuth from '../../hooks/useAuth'
import ReelsCommentReplyReply from '../ReelsCommentReplyReply'
import { useNavigation, useRoute } from '@react-navigation/native'
import UserAvatar from './components/UserAvatar'
import UserInfo from './components/UserInfo'

const { width } = Dimensions.get('window')

const ViewReelsCommentReplies = ({ comment, screen }) => {
  const { user, userProfile, showExpand, setShowExpand } = useAuth()
  const navigation = useNavigation()
  const route = useRoute()

  const [replies, setReplies] = useState([])

  useEffect(() => {
    (() => {
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
        data={replies}
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
                    flexDirection: 'row'
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      maxWidth: width - 120
                    }}
                  >
                    <UserInfo user={reply?.reelComment?.user?.id} />
                    <Text
                      style={{
                        color: color.white
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
                <LikeReelsReply reply={reply} screen={screen} />
                <ReelsCommentReplyReply comment={reply} />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default ViewReelsCommentReplies
// for reels