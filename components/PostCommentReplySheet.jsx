import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'

import RBSheet from 'react-native-raw-bottom-sheet'
import useAuth from '../hooks/useAuth'
import color from '../style/color'
import Comments from './Comments'
import NewComment from './NewComment'

import { FontAwesome5 } from '@expo/vector-icons'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

const PostCommentReplySheet = (props) => {
  const { userProfile } = useAuth()
  const refCommentSheet = useRef()

  const comment = props?.comment

  const [height, setHeight] = useState(50)
  const [reply, setReply] = useState('')

  const sendCommentReply = async () => {
    if (reply != '')
      await addDoc(collection(db, 'posts', comment?.post?.id, 'comments', comment?.id, 'replies'), {
        reply,
        post: comment?.post,
        comment: comment?.id,
        likesCount: 0,
        repliesCount: 0,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          username: userProfile?.username,
          photoURL: userProfile?.photoURL
        },
        timestamp: serverTimestamp()
      }).then(async () => {
        if (comment?.post?.user?.id != userProfile?.id)
          await addDoc(collection(db, 'users', comment?.post?.user?.id, 'notifications'), {
            action: 'post',
            activity: 'reply',
            text: 'replied to a post you commented on',
            notify: comment?.post?.user,
            id: comment?.post?.id,
            seen: false,
            post: comment?.post,
            user: {
              id: userProfile?.id,
              username: userProfile?.username,
              displayName: userProfile?.displayName,
              photoURL: userProfile?.photoURL
            },
            timestamp: serverTimestamp()
          })
      })

    await updateDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })
    setReply('')

    if (comment?.user?.id != userProfile?.id) {
      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'post',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: comment?.id,
        seen: false,
        post: comment?.post,
        user: {
          id: userProfile?.id,
          username: userProfile?.username,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL
        },
        timestamp: serverTimestamp()
      })
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => refCommentSheet?.current?.open()}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 2
        }}
      >
        <Text
          style={{
            color: color.white,
            fontFamily: 'text'
          }}
        >
          Reply
        </Text>
      </TouchableOpacity>

      <RBSheet
        openDuration={300}
        closeDuration={300}
        ref={refCommentSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            borderTopWidth: .3,
            borderTopColor: color.borderColor,
            backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
            minHeight: 50,
            overflow: 'hidden',
            position: 'relative',
            marginHorizontal: 10,
            borderRadius: 12
          }}
        >
          <TextInput
            multiline
            value={reply}
            onChangeText={setReply}
            onSubmitEditing={() => sendCommentReply}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            placeholder={`Reply @${comment?.user?.username}`}
            placeholderTextColor={userProfile?.appMode == 'light' ? color.lightText : color.white}
            style={{
              fontSize: 18,
              flex: 1,
              width: '100%',
              height,
              minHeight: 50,
              maxHeight: 150,
              fontFamily: 'text',
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              paddingRight: 40,
              paddingVertical: 5
            }}
          />

          <TouchableOpacity
            onPress={sendCommentReply}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10
            }}>
            <FontAwesome5
              name='paper-plane'
              color={userProfile?.appMode == 'light' ? color.lightText : color.white}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </RBSheet>
    </>
  )
}

export default PostCommentReplySheet