import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'

import { useFonts } from 'expo-font'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import color from '../style/color'
import LikeReelsReply from './LikeReelsReply'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import ReelsCommentReplyReply from './ReelsCommentReplyReply'

const ReelsCommentReplies = (props) => {
  const { userProfile, setBottomSheetIndex, bottomSheetIndex } = useAuth()
  const comments = props.comment
  const [replies, setReplies] = useState([])

  const navigation = useNavigation()

  useEffect(() =>
    onSnapshot(collection(db, 'reels', comments?.reel?.id, 'comments', comments?.id, 'replies'),
      snapshot =>
        setReplies(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
    )
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
        // data={replies.splice(0, 1)}
        data={replies}
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
                  backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: userProfile?.appMode == 'light' ? color.dark : color.white,
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
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setBottomSheetIndex(-1)
                      reply?.reelComment?.user?.id == userProfile?.id ? navigation.navigate('Profile') : navigation.navigate('UserProfile', { user: reply?.reelComment?.user })
                    }}
                  >
                    <Text
                      style={{
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
                        fontFamily: 'boldText'
                      }}
                    >
                      @{reply?.reelComment?.user?.username}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: userProfile?.appMode == 'light' ? color.dark : color.white,
                      marginLeft: 10
                    }}
                  >
                    {reply?.reply}
                  </Text>
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
                <LikeReelsReply reply={reply} />
                <ReelsCommentReplyReply reply={reply} />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default ReelsCommentReplies