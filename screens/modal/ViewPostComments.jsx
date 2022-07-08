import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'

import Bar from '../../components/StatusBar'
import ViewCommentsLikecomments from '../../components/ViewCommentsLikecomments'
import PostCommentReply from '../../components/PostCommentReply'
import CommentReplies from '../../components/CommentReplies'
import Header from '../../components/Header'
import CommentsScreenNewComment from '../../components/CommentsScreenNewComment'

const ViewPostComments = () => {
  const { userProfile, showExpand, setShowExpand, setReplyCommentProps, user } = useAuth()
  const navigation = useNavigation()
  const route = useRoute()

  const { comment, reply, commentId, replyId } = route.params

  const [scrrenComment, setScrrenComment] = useState(null)
  // const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: comment?.likesCount })

  navigation.addListener('blur', () => {
    setShowExpand(true)
  })

  useEffect(() => {
    setReplyCommentProps(comment)
  }, [])

  useEffect(() => {
    setShowExpand(false)
  }, [])

  // useEffect(() => {
  //   (async () => {
  //     const x = await (await getDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id))).data()
  //     setScrrenComment(x)
  //   })()
  // }, [])

  // useEffect(() => {
  //   (() => {
  //     getLikesById(commentId, user?.uid)
  //       .then(res => {
  //         setCurrentLikesState({
  //           ...currentLikesState,
  //           state: res
  //         })
  //       })
  //   })()
  // }, [])

  // const getLikesById = () => new Promise(async (resolve, reject) => {
  //   getDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id, 'likes', user?.uid))
  //     .then(res => resolve(res?.exists()))
  // })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

      <Header showBack showTitle title={`${comment?.post?.commentsCount} Comments`} />

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
                <ViewCommentsLikecomments textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={comment} commentId={commentId} />

                <PostCommentReply textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={comment} />
              </View>

              <CommentReplies
                showAll={true}
                backgroundColor={userProfile?.theme == 'dark' ? color.dark : color.offWhite}
                textColor={userProfile?.theme == 'dark' ? color.white : color.dark}
                comment={comment}
                screen={userProfile?.theme == 'dark' ? color.white : color.dark}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <CommentsScreenNewComment defaultType={route.name == 'ViewPostComments' ? 'reply' : 'comment'} post={comment?.post} />
    </View>
  )
}

export default ViewPostComments