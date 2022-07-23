import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import color from '../style/color'

import { useFonts } from 'expo-font'

import { Octicons } from '@expo/vector-icons'
import LikeReelsReply from './LikeReelsReply'
import useAuth from '../hooks/useAuth'
import ReelsCommentReplyReply from './ReelsCommentReplyReply'
import { useNavigation, useRoute } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const ViewReelsCommentReplies = ({ comment, screen }) => {
  const { user, userProfile, showExpand, setShowExpand } = useAuth()
  const navigation = useNavigation()
  const route = useRoute()

  const [replies, setReplies] = useState([])

  useEffect(() =>
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
            <TouchableOpacity
              onPress={() => {
                comment?.user?.id != user?.uid ?
                  navigation.navigate('UserProfile', { user: reply?.user }) :
                  navigation.navigate('Profile')
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
            </TouchableOpacity>
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
                <Text
                  style={{
                    color: color.white,
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
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      maxWidth: width - 120
                    }}
                  >
                    <Text
                      style={{
                        color: color.white,
                        fontFamily: 'boldText',
                        marginRight: 5
                      }}
                    >
                      @{reply?.reelComment?.user?.username}
                    </Text>
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