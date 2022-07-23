import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'

import { useFonts } from 'expo-font'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import color from '../style/color'
import LikeReelsReply from './LikeReelsReply'
import useAuth from '../hooks/useAuth'
import { useNavigation, useRoute } from '@react-navigation/native'
import ReelsCommentReplyReply from './ReelsCommentReplyReply'
import { Octicons } from '@expo/vector-icons'

const ReelsCommentReplies = ({ comment, textColor, showAll, background }) => {
  const { user, userProfile, showExpand, setShowExpand } = useAuth()
  const [replies, setReplies] = useState([])

  const navigation = useNavigation()
  const route = useRoute()

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
        data={showAll ? replies : replies?.length > 1 ? replies?.splice(0, 1) : replies}
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
                  width: 25,
                  height: 25,
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
                  {reply?.user?.username}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
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