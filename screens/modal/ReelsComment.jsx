import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'
import useAuth from '../../hooks/useAuth'

import * as NavigationBar from 'expo-navigation-bar'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'

import ReelsComments from '../../components/ReelsComments'

import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'

import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import { useFonts } from 'expo-font'

import { FlatGrid } from 'react-native-super-grid'

import smileys from '../../components/emoji/smileys'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const ReelsComment = () => {
  const {
    user,
    userProfile,
    reelsProps,
    setReelsProps,
    reelsCommentType,
    setReelsCommentType,
    replyCommentProps,
    setReplyCommentProps,
    commentAutoFocus
  } = useAuth()

  const navigation = useNavigation()

  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setBackgroundColorAsync(color.transparent)
  NavigationBar.setButtonStyleAsync('light')
  NavigationBar.setVisibilityAsync('hidden')
  NavigationBar.setBehaviorAsync('overlay-swipe')

  navigation.addListener('beforeRemove', () => {
    NavigationBar.setVisibilityAsync('visible')
    NavigationBar.setPositionAsync('relative')
    NavigationBar.setBackgroundColorAsync(userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black)
    NavigationBar.setButtonStyleAsync(userProfile?.appMode == 'light' ? 'dark' : 'light')
  })

  const [comment, setComment] = useState('')
  const [reply, setReply] = useState('')
  const [height, setHeight] = useState(40)
  const [expanded, setExpanded] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setReelsCommentType('comment')
    })
  }, [])

  const sendComment = async () => {
    if (comment != '') {
      addDoc(collection(db, 'reels', reelsProps?.id, 'comments'), {
        comment,
        reel: reelsProps,
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

      await updateDoc(doc(db, 'reels', reelsProps?.id), {
        commentsCount: increment(1)
      })

      if (reelsProps?.user?.id != user?.uid)
        await addDoc(collection(db, 'users', reelsProps?.user?.id, 'notifications'), {
          action: 'reel',
          activity: 'comments',
          text: 'commented on your post',
          notify: reelsProps?.user,
          id: reelsProps?.id,
          seen: false,
          reel: reelsProps,
          user: {
            id: userProfile?.id,
            username: userProfile?.username,
            displayName: userProfile?.displayName,
            photoURL: userProfile?.photoURL
          },
          timestamp: serverTimestamp()
        })
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
        if (comment?.reel?.user?.id != userProfile?.id)
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
      })

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })
    setReply('')

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

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.comment, 'replies', comment?.id), {
      repliesCount: increment(1)
    })
    setReply('')
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={{ uri: reelsProps?.thumbnail }}
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
                  color: userProfile?.appMode == 'light' ? color.dark : color.white
                }}
              >
                {reelsProps?.commentsCount || '0'}
              </Text>
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: userProfile?.appMode == 'light' ? color.dark : color.white,
                  marginLeft: 10
                }}
              >
                {reelsProps?.commentsCount == 1 ? 'Comment' : 'Comments'}
              </Text>
            </View>
          </View>

          <ReelsComments reel={reelsProps} />

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
              value={reelsCommentType == 'comment' ? comment : reelsCommentType == 'reply' ? reply : reply}
              onChangeText={reelsCommentType == 'comment' ? setComment : reelsCommentType == 'reply' ? setReply : setReply}
              onSubmitEditing={sendComment}
              placeholder={reelsCommentType == 'comment' ? 'Write a comment...' : reelsCommentType == 'reply' ? `Reply @${replyCommentProps?.user?.username}` : `Reply @${replyCommentProps?.user?.username}`}
              placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              autoFocus={commentAutoFocus}
              style={{
                fontSize: 18,
                flex: 1,
                width: '100%',
                height,
                minHeight: 50,
                maxHeight: 150,
                fontFamily: 'text',
                color: userProfile?.appMode == 'light' ? color.dark : color.white,
                paddingRight: 40 + 50,
                paddingVertical: 5
              }}
            />

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss()
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                setExpanded(!expanded)

                setTimeout(() => setShowEmoji(!showEmoji), 500)
              }}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 50,
                bottom: 0
              }}>
              <MaterialCommunityIcons name='emoticon-happy-outline' color={userProfile?.appMode == 'light' ? color.lightText : color.white} size={26} />
            </TouchableOpacity>

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
                color={userProfile?.appMode == 'light' ? color.lightText : color.white}
                size={20}
              />
            </TouchableOpacity>
          </View>

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

          {
            expanded && (
              <View style={{ minWidth: 200, maxHeight: 200 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                  }}
                >
                  {
                    showEmoji &&
                    <FlatGrid
                      data={smileys}
                      itemDimension={30}
                      renderItem={({ item: emoji }) => (
                        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? setComment(comment + emoji.emoji) : reelsCommentType == 'reply' ? setReply(reply + emoji.emoji) : setReply(reply + emoji.emoji)}>
                          <Text style={{ fontSize: 30 }}>{emoji.emoji}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  }
                </View>
              </View>
            )
          }
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ReelsComment