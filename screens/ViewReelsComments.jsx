import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addDoc, collection, doc, getDoc, increment, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import color from '../style/color'
import useAuth from '../hooks/useAuth'

import Bar from '../components/StatusBar'
import ViewReelsCommentsLikecomments from '../components/ViewReelsCommentsLikecomments'
import PostCommentReply from '../components/PostCommentReply'
import ViewReelsCommentReplies from '../components/ViewReelsCommentReplies'

import { FontAwesome5, Entypo } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

import { appToken } from '@env'
import axios from 'axios'
import { BlurView } from 'expo-blur'

const ViewReelsComments = () => {
  const {
    user,
    userProfile,
    showExpand,
    setShowExpand,
    setReplyCommentProps,
    reelsCommentType,
    replyCommentProps,
    setReelsCommentType
  } = useAuth()

  const navigation = useNavigation()
  const { comment, background } = useRoute().params

  const [_comment, _setComment] = useState('')
  const [reply, setReply] = useState('')
  const [height, setHeight] = useState(40)
  const [commentsCount, setCommentsCount] = useState('')

  navigation.addListener('blur', () => {
    setShowExpand(true)
  })

  useLayoutEffect(() => {
    setShowExpand(false)
  }, [])

  useLayoutEffect(() => setReelsCommentType('reply'), [])

  useLayoutEffect(() =>
    (() => {
      onSnapshot(doc(db, 'reels', comment?.reel?.id),
        doc => {
          setCommentsCount(doc?.data().commentsCount)
        })
    })()
    , [])

  const sendCommentReply = async () => {
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
            subID: comment?.reel?.user?.id,
            appId: 3167,
            appToken,
            title: '💬💬💬💬',
            message: `@${userProfile?.username} replied to your comment (${_comment.slice(0, 100)})`
          })
        }
      })

    setReply('')
    setReelsCommentType('reply')

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', comment?.reel?.id), {
      commentsCount: increment(1)
    })
  }

  const sendCommentReplyReply = async () => {
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
            subID: comment?.reel?.user?.id,
            appId: 3167,
            appToken,
            title: '💬💬💬💬',
            message: `@${userProfile?.username} replied to your comment (${_comment.slice(0, 100)})`
          })
        }
      })

    setReply('')
    setReelsCommentType('reply')

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', comment?.reel?.id), {
      commentsCount: increment(1)
    })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <ImageBackground
      source={{ uri: background }}
      blurRadius={10}
      style={{ flex: 1 }}
    >
      <BlurView
        tint='dark'
        intensity={100}
        style={{ flex: 1 }}
      >
        <Bar color='light' />

        <View
          style={{
            marginTop: 30,
            height: 40,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
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
              {commentsCount || '0'}
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: color.white,
                marginLeft: 10
              }}
            >
              {commentsCount == 1 ? 'Comment' : 'Comments'}
            </Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginVertical: 10
            }}
          >
            <TouchableOpacity
              onPress={() => {
                comment?.user?.id != user?.uid ?
                  navigation.navigate('UserProfile', { user: comment?.user }) :
                  navigation.navigate('Profile')
              }}
            >
              <Image
                source={{ uri: comment?.user?.photoURL }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 50
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
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
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    fontSize: 13
                  }}
                >
                  @{comment?.user?.username}
                </Text>
                <Text
                  style={{
                    color: color.white
                  }}
                >
                  {comment?.comment}
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 10,
                  marginTop: 5
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
                  <ViewReelsCommentsLikecomments comment={comment} />

                  <PostCommentReply comment={comment} />
                </View>

                <ViewReelsCommentReplies showAll={true} comment={comment} />
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '🤣') : setReply(reply + '🤣')}>
            <Text style={{ fontSize: 30 }}>🤣</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '😭') : setReply(reply + '😭')}>
            <Text style={{ fontSize: 30 }}>😭</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '🥺') : setReply(reply + '🥺')}>
            <Text style={{ fontSize: 30 }}>🥺</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '😏') : setReply(reply + '😏')}>
            <Text style={{ fontSize: 30 }}>😏</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '🤨') : setReply(reply + '🤨')}>
            <Text style={{ fontSize: 30 }}>🤨</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '🙄') : setReply(reply + '🙄')}>
            <Text style={{ fontSize: 30 }}>🙄</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '😍') : setReply(reply + '😍')}>
            <Text style={{ fontSize: 30 }}>😍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? setReply(reply + '❤️') : setReply(reply + '❤️')}>
            <Text style={{ fontSize: 30 }}>❤️</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            minHeight: 50,
            overflow: 'hidden',
            position: 'relative',
            marginHorizontal: 10,
            marginBottom: 10,
            borderRadius: 12,
            overflow: 'hidden'
          }}
        >
          <TextInput
            multiline
            value={reelsCommentType == 'reply' ? reply : reply}
            onChangeText={reelsCommentType == 'reply' ? setReply : setReply}
            placeholder={reelsCommentType == 'reply' ? `Reply @${comment?.user?.username}` : `Reply @${comment?.user?.username}'s comment`}
            placeholderTextColor={color.lightText}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            style={{
              fontSize: 18,
              flex: 1,
              width: '100%',
              height,
              minHeight: 50,
              maxHeight: 150,
              fontFamily: 'text',
              paddingRight: 40 + 50,
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: color.white,
            }}
          />

          <TouchableOpacity
            onPress={reelsCommentType == 'reply' ? sendCommentReply : sendCommentReplyReply}
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
              color={color.lightText}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </ImageBackground>
  )
}

export default ViewReelsComments