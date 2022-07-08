import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native'

import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import color from '../style/color'

import useAuth from '../hooks/useAuth'
import { useFonts } from 'expo-font'

import { FontAwesome5 } from '@expo/vector-icons'

import { appToken } from '@env'
import axios from 'axios'

const NewComment = ({ post }) => {
  const { userProfile, postCommentType, replyCommentProps, setPostCommentType } = useAuth()

  const [height, setHeight] = useState(50)
  const [input, setInput] = useState('')

  Keyboard.addListener('keyboardDidHide', () => {
    setPostCommentType('comment')
  })

  useEffect(() => {
    setPostCommentType('comment')
  }, [])

  const sendComment = async () => {
    setInput('')
    if (input != '')
      addDoc(collection(db, 'posts', post?.id, 'comments'), {
        comment: input,
        post,
        likesCount: 0,
        repliesCount: 0,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL,
          username: userProfile?.username,
        },
        timestamp: serverTimestamp()
      }).then(async () => {
        if (post?.user?.id != userProfile?.id)
          await addDoc(collection(db, 'users', post?.user?.id, 'notifications'), {
            action: 'post',
            activity: 'comments',
            text: 'commented on your post',
            notify: post?.user,
            id: post?.id,
            seen: false,
            post,
            user: {
              id: userProfile?.id,
              username: userProfile?.username,
              displayName: userProfile?.displayName,
              photoURL: userProfile?.photoURL
            },
            timestamp: serverTimestamp()
          }).then(() => {
            axios.post(`https://app.nativenotify.com/api/indie/notification`, {
              subID: post?.user?.id,
              appId: 3167,
              appToken,
              title: '💬',
              message: `@${userProfile?.username} commented on your post (${input.slice(0, 100)})`
            })
          })
      })

    await updateDoc(doc(db, 'posts', post?.id), {
      commentsCount: increment(1)
    })
  }

  const sendCommentReply = async comment => {
    setInput('')
    setPostCommentType('comment')

    if (input != '')
      await addDoc(collection(db, 'posts', comment?.post?.id, 'comments', comment?.id, 'replies'), {
        reply: input,
        post: comment?.post,
        comment: comment?.id,
        likesCount: 0,
        repliesCount: 0,
        postReply: comment,
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
          }).then(() => {
            axios.post(`https://app.nativenotify.com/api/indie/notification`, {
              subID: comment?.post?.user?.id,
              appId: 3167,
              appToken,
              title: '💬',
              message: `@${userProfile?.username} replied to your comment (${input.slice(0, 100)})`
            })
          })
      })

    await updateDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'posts', post?.id), {
      commentsCount: increment(1)
    })

    if (comment?.user?.id != userProfile?.id)
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

  const sendCommentReplyReply = async comment => {
    setPostCommentType('comment')
    setInput('')

    if (input != '')
      await addDoc(collection(db, 'posts', comment?.post?.id, 'comments', comment?.comment, 'replies'), {
        reply: input,
        post: comment?.post,
        comment: comment?.comment,
        reelReply: comment,
        likesCount: 0,
        repliesCount: 0,
        postReply: comment,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          username: userProfile?.username,
          photoURL: userProfile?.photoURL
        },
        timestamp: serverTimestamp()
      })

    await updateDoc(doc(db, 'reels', comment?.post?.id, 'comments', comment?.comment, 'replies', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'posts', post?.id), {
      commentsCount: increment(1)
    })

  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View>
      <View
        style={{
          paddingHorizontal: 10,
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity onPress={() => setInput(input + '🤣')}>
          <Text style={{ fontSize: 30 }}>🤣</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInput(input + '😭')}>
          <Text style={{ fontSize: 30 }}>😭</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInput(input + '🥺')}>
          <Text style={{ fontSize: 30 }}>🥺</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInput(input + '😏')}>
          <Text style={{ fontSize: 30 }}>😏</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInput(input + '🤨')}>
          <Text style={{ fontSize: 30 }}>🤨</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInput(input + '🙄')}>
          <Text style={{ fontSize: 30 }}>🙄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInput(input + '😍')}>
          <Text style={{ fontSize: 30 }}>😍</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInput(input + '❤️')}>
          <Text style={{ fontSize: 30 }}>❤️</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          backgroundColor: color.white,
          minHeight: 50,
          overflow: 'hidden',
          position: 'relative',
          marginHorizontal: 10,
          borderRadius: 12,
          marginVertical: 10
        }}
      >
        <TextInput
          multiline
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendComment}
          placeholder={postCommentType == 'comment' ? 'Write a comment...' : `reply @${replyCommentProps?.user?.username}`}
          placeholderTextColor={color.lightText}
          onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
          style={{
            fontSize: 18,
            flex: 1,
            height,
            minHeight: 50,
            maxHeight: 150,
            fontFamily: 'text',
            color: color.dark,
            paddingRight: 40 + 50,
            paddingVertical: 5
          }}
        />
        <TouchableOpacity
          onPress={() => postCommentType == 'comment' ? sendComment() : postCommentType == 'reply' ? sendCommentReply(replyCommentProps) : sendCommentReplyReply(replyCommentProps)}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 0,
            bottom: 0
          }}>
          <FontAwesome5
            name='paper-plane'
            color={userProfile?.theme == 'light' ? color.lightText : color.white}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NewComment