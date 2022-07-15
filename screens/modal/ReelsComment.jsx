import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'
import useAuth from '../../hooks/useAuth'

import color from '../../style/color'
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native'

import ReelsComments from '../../components/ReelsComments'

import { FontAwesome5, Entypo } from '@expo/vector-icons'

import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import { useFonts } from 'expo-font'

import Bar from '../../components/StatusBar'

import { appToken } from '@env'
import axios from 'axios'

const ReelsComment = () => {
  const {
    user,
    userProfile,
    reelsCommentType,
    setReelsCommentType,
    replyCommentProps,
    setReplyCommentProps,
  } = useAuth()

  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { item } = useRoute().params

  const [comment, setComment] = useState('')
  const [reply, setReply] = useState('')
  const [height, setHeight] = useState(40)

  Keyboard.addListener('keyboardDidHide', () => {
    setReelsCommentType('comment')
  })

  const sendComment = async () => {
    if (comment != '') {
      addDoc(collection(db, 'reels', item?.id, 'comments'), {
        comment,
        reel: item,
        commentsCount: 0,
        likesCount: 0,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL,
          username: userProfile?.username,
        },
        timestamp: serverTimestamp()
      })

      await updateDoc(doc(db, 'reels', item?.id), {
        commentsCount: increment(1)
      })

      if (item?.user?.id != user?.uid) {
        await addDoc(collection(db, 'users', item?.user?.id, 'notifications'), {
          action: 'reel',
          activity: 'comments',
          text: 'commented on your post',
          notify: item?.user,
          id: item?.id,
          seen: false,
          reel: item,
          user: {
            id: userProfile?.id,
            username: userProfile?.username,
            displayName: userProfile?.displayName,
            photoURL: userProfile?.photoURL
          },
          timestamp: serverTimestamp()
        })

        axios.post(`https://app.nativenotify.com/api/indie/notification`, {
          subID: item?.user?.id,
          appId: 3167,
          appToken,
          title: '💬',
          message: `@${userProfile?.username} commented on your video (${comment.slice(0, 100)})`
        })
      }

      setComment('')
    }
  }

  const sendCommentReply = async () => {
    let comment = replyCommentProps

    if (reply != '')
      await addDoc(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'replies'), {
        reply,
        reel: comment?.reel,
        comment: comment?.id,
        reelComment: comment,
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
        if (comment?.reel?.user?.id != userProfile?.id) {
          await addDoc(collection(db, 'users', comment?.reel?.user?.id, 'notifications'), {
            action: 'reel',
            activity: 'reply',
            text: 'replied to a post you commented on',
            notify: comment?.reel?.user,
            id: comment?.reel?.id,
            seen: false,
            reel: comment?.reel,
            user: {
              id: userProfile?.id,
              username: userProfile?.username,
              displayName: userProfile?.displayName,
              photoURL: userProfile?.photoURL
            },
            timestamp: serverTimestamp()
          })

          axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: item?.user?.id,
            appId: 3167,
            appToken,
            title: '💬',
            message: `@${userProfile?.username} replied to your comment (${comment.slice(0, 100)})`
          })
        }
      })

    setReply('')

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', item?.id), {
      commentsCount: increment(1)
    })

    if (comment?.user?.id != userProfile?.id)
      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'reel',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: comment?.id,
        seen: false,
        reel: comment?.reel,
        user: {
          id: userProfile?.id,
          username: userProfile?.username,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL
        },
        timestamp: serverTimestamp()
      })

    axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: item?.user?.id,
      appId: 3167,
      appToken,
      title: '💬',
      message: `@${userProfile?.username} replied to your comment (${comment.slice(0, 100)})`
    })

    setReelsCommentType('comment')
  }

  const sendCommentReplyReply = async () => {
    let comment = replyCommentProps

    if (reply != '')
      await addDoc(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.comment, 'replies', comment?.id, 'reply'), {
        reply,
        reel: comment?.reel,
        comment: comment?.comment,
        reelReply: comment,
        likesCount: 0,
        repliesCount: 0,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          username: userProfile?.username,
          photoURL: userProfile?.photoURL
        },
        timestamp: serverTimestamp()
      })

    setReply('')

    setReelsCommentType('comment')

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.comment, 'replies', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', item?.id), {
      commentsCount: increment(1)
    })
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Bar color='light' />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={{ uri: item?.thumbnail }}
          blurRadius={50}
          style={{ flex: 1 }}
        >
          <View
            style={{
              marginTop: 30,
              height: 40,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Entypo name='chevron-left' size={24} color={color.white} />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: color.white
                }}
              >
                {item?.commentsCount || '0'}
              </Text>
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: color.white,
                  marginLeft: 10
                }}
              >
                {item?.commentsCount == 1 ? 'Comment' : 'Comments'}
              </Text>
            </View>
          </View>

          <ReelsComments reel={item} />

          <View
            style={{
              paddingHorizontal: 10,
              marginVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '🤣') : reelsCommentType == 'reply' ? setReply(reply + '🤣') : setReply(reply + '🤣')}>
              <Text style={{ fontSize: 30 }}>🤣</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '😭') : reelsCommentType == 'reply' ? setReply(reply + '😭') : setReply(reply + '😭')}>
              <Text style={{ fontSize: 30 }}>😭</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '🥺') : reelsCommentType == 'reply' ? setReply(reply + '🥺') : setReply(reply + '🥺')}>
              <Text style={{ fontSize: 30 }}>🥺</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '😏') : reelsCommentType == 'reply' ? setReply(reply + '😏') : setReply(reply + '😏')}>
              <Text style={{ fontSize: 30 }}>😏</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '🤨') : reelsCommentType == 'reply' ? setReply(reply + '🤨') : setReply(reply + '🤨')}>
              <Text style={{ fontSize: 30 }}>🤨</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '🙄') : reelsCommentType == 'reply' ? setReply(reply + '🙄') : setReply(reply + '🙄')}>
              <Text style={{ fontSize: 30 }}>🙄</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '😍') : reelsCommentType == 'reply' ? setReply(reply + '😍') : setReply(reply + '😍')}>
              <Text style={{ fontSize: 30 }}>😍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + '❤️') : reelsCommentType == 'reply' ? setReply(reply + '❤️') : setReply(reply + '❤️')}>
              <Text style={{ fontSize: 30 }}>❤️</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              borderTopWidth: .3,
              borderTopColor: color.borderColor,
              backgroundColor: color.white,
              minHeight: 50,
              overflow: 'hidden',
              position: 'relative',
              marginHorizontal: 10,
              borderRadius: 12,
              marginBottom: 10
            }}
          >
            <TextInput
              multiline
              value={reelsCommentType == 'comment' ? comment : reelsCommentType == 'reply' ? reply : reply}
              onChangeText={reelsCommentType == 'comment' ? setComment : reelsCommentType == 'reply' ? setReply : setReply}
              onSubmitEditing={sendComment}
              placeholder={reelsCommentType == 'comment' ? 'Write a comment...' : reelsCommentType == 'reply' ? `Reply @${replyCommentProps?.user?.username}` : `Reply @${replyCommentProps?.user?.username}`}
              placeholderTextColor={userProfile?.theme == 'light' ? color.dark : color.white}
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              style={{
                fontSize: 18,
                flex: 1,
                width: '100%',
                height,
                minHeight: 50,
                maxHeight: 150,
                fontFamily: 'text',
                color: userProfile?.theme == 'light' ? color.dark : color.white,
                paddingRight: 40 + 50,
                paddingVertical: 5
              }}
            />

            <TouchableOpacity
              onPress={reelsCommentType == 'comment' ? sendComment : reelsCommentType == 'reply' ? sendCommentReply : sendCommentReplyReply}
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
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ReelsComment