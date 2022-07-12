import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addDoc, collection, doc, getDoc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'

import Bar from '../../components/StatusBar'
import ViewReelsCommentsLikecomments from '../../components/ViewReelsCommentsLikecomments'
import PostCommentReply from '../../components/PostCommentReply'
import ViewReelsCommentReplies from '../../components/ViewReelsCommentReplies'
import Header from '../../components/Header'
import CommentsScreenNewComment from '../../components/CommentsScreenNewComment'

import { FontAwesome5, Entypo } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

import { appToken } from '@env'
import axios from 'axios'

const ViewReelsComments = () => {
  const {
    userProfile,
    showExpand,
    setShowExpand,
    setReplyCommentProps,
    reelsCommentType,
    replyCommentProps,
    setReelsCommentType
  } = useAuth()

  const navigation = useNavigation()
  const { comment } = useRoute().params

  const [_comment, _setComment] = useState('')
  const [reply, setReply] = useState('')
  const [height, setHeight] = useState(40)

  navigation.addListener('blur', () => {
    setShowExpand(true)
  })

  useEffect(() => {
    setShowExpand(false)
  }, [])

  useEffect(() => setReelsCommentType('reply'))

  const sendComment = async () => {
    if (_comment != '') {
      addDoc(collection(db, 'reels', comment?.reel?.id, 'comments'), {
        comment: _comment,
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

      await updateDoc(doc(db, 'reels', comment?.reel?.id), {
        commentsCount: increment(1)
      })

      if (comment?.reel?.user?.id != user?.uid) {
        await addDoc(collection(db, 'users', comment?.reel?.user?.id, 'notifications'), {
          action: 'reel',
          activity: 'comments',
          text: 'commented on your post',
          notify: comment?.reel?.user,
          id: comment?.reel?.id,
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
          subID: comment?.reel?.user?.id,
          appId: 3167,
          appToken,
          title: '💬',
          message: `@${userProfile?.username} commented on your video (${_comment.slice(0, 100)})`
        })
      }

      _setComment('')
    }
  }

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
            title: '💬',
            message: `@${userProfile?.username} replied to your comment (${_comment.slice(0, 100)})`
          })
        }
      })

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', comment?.reel?.id), {
      commentsCount: increment(1)
    })

    setReply('')
    setReelsCommentType('reply')
  }

  const sendCommentReplyReply = async () => {
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

    await updateDoc(doc(db, 'reels', comment?.reel?.id), {
      commentsCount: increment(1)
    })

    setReply('')
    setReelsCommentType('reply')
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

      <Header showBack showTitle title={`${comment?.reel?.commentsCount} Comments`} />

      <ScrollView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginVertical: 10
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
          <View
            style={{
              width: '100%',
              alignItems: 'flex-start'
            }}
          >
            <View
              style={{
                marginLeft: 10,
                backgroundColor: userProfile?.theme == 'dark' ? color.white : color.offWhite,
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: userProfile?.theme == 'dark' ? color.white : color.dark,
                  fontFamily: 'text',
                  fontSize: 13
                }}
              >
                @{comment?.user?.username}
              </Text>
              <Text
                style={{
                  color: userProfile?.theme == 'dark' ? color.white : color.dark
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
                <ViewReelsCommentsLikecomments textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={comment} />

                <PostCommentReply textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={comment} />
              </View>

              <ViewReelsCommentReplies showAll={true} backgroundColor={userProfile?.theme == 'dark' ? color.dark : color.offWhite} textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={comment} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* <CommentsScreenNewComment defaultType={route.name == 'ViewReelsComments' ? 'reply' : 'comment'} post={comment?.post} /> */}
      <View
        style={{
          paddingHorizontal: 10,
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '🤣') : reelsCommentType == 'reply' ? setReply(reply + '🤣') : setReply(reply + '🤣')}>
          <Text style={{ fontSize: 30 }}>🤣</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '😭') : reelsCommentType == 'reply' ? setReply(reply + '😭') : setReply(reply + '😭')}>
          <Text style={{ fontSize: 30 }}>😭</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '🥺') : reelsCommentType == 'reply' ? setReply(reply + '🥺') : setReply(reply + '🥺')}>
          <Text style={{ fontSize: 30 }}>🥺</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '😏') : reelsCommentType == 'reply' ? setReply(reply + '😏') : setReply(reply + '😏')}>
          <Text style={{ fontSize: 30 }}>😏</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '🤨') : reelsCommentType == 'reply' ? setReply(reply + '🤨') : setReply(reply + '🤨')}>
          <Text style={{ fontSize: 30 }}>🤨</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '🙄') : reelsCommentType == 'reply' ? setReply(reply + '🙄') : setReply(reply + '🙄')}>
          <Text style={{ fontSize: 30 }}>🙄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '😍') : reelsCommentType == 'reply' ? setReply(reply + '😍') : setReply(reply + '😍')}>
          <Text style={{ fontSize: 30 }}>😍</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reelsCommentType == 'comment' ? _setComment(_comment + '❤️') : reelsCommentType == 'reply' ? setReply(reply + '❤️') : setReply(reply + '❤️')}>
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
          value={reelsCommentType == 'comment' ? _comment : reelsCommentType == 'reply' ? reply : reply}
          onChangeText={reelsCommentType == 'comment' ? _setComment : reelsCommentType == 'reply' ? setReply : setReply}
          onSubmitEditing={sendComment}
          placeholder={reelsCommentType == 'comment' ? 'Write a comment...' : reelsCommentType == 'reply' ? `Reply @${comment?.user?.username}` : `Reply @${comment?.user?.username}`}
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
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
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
    </View>
  )
}

export default ViewReelsComments