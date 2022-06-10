import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Dimensions, FlatList, Image } from 'react-native'

import RBSheet from 'react-native-raw-bottom-sheet'
import useAuth from '../hooks/useAuth'
import color from '../style/color'
import Comments from './Comments'
import NewComment from './NewComment'

import { Octicons } from '@expo/vector-icons'

import { FontAwesome5 } from '@expo/vector-icons'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import PostCommentReplyReplySheet from './PostCommentReplyReplySheet'
import LikeReply from './LikeReply'

const AllPostCommentReplies = (props) => {
  const { userProfile } = useAuth()
  const refCommentSheet = useRef()

  const reply = props?.reply
  const replies = props?.replies

  return (
    <>
      {/* <TouchableOpacity
        onPress={() => refCommentSheet.current.open()}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 2
        }}
      >
        <Text
          style={{
            color: userProfile?.appMode == 'light' ? color.dark : color.white,
            fontFamily: 'text'
          }}
        >
          Reply
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => refCommentSheet.current.open()}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 10
        }}
      >
        <Octicons name='reply' size={18} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
        <Text
          style={{
            fontFamily: 'text',
            marginLeft: 5,
            fontSize: 14,
            color: userProfile?.appMode == 'light' ? color.lightText : color.white
          }}
        >
          {replies?.length} Replies
        </Text>
      </TouchableOpacity>

      <RBSheet
        openDuration={300}
        closeDuration={300}
        ref={refCommentSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={(Dimensions.get('window').height / 2) + 200}
        customStyles={{
          wrapper: {
            backgroundColor: color.faintBlack
          },
          container: {
            backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          },
          draggableIcon: {
            backgroundColor: userProfile?.appMode == 'light' ? color.black : color.white
          }
        }}
      >
        <FlatList
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
                    {reply?.user?.displayName}
                  </Text>
                  <Text
                    style={{
                      color: userProfile?.appMode == 'light' ? color.dark : color.white
                    }}
                  >
                    {reply?.reply}
                  </Text>
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
                  <LikeReply reply={reply} />
                  <PostCommentReplyReplySheet comment={reply} />
                </View>
              </View>
            </View>
          )}
        />
      </RBSheet>
    </>
  )
}

export default AllPostCommentReplies