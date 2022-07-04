import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'

import Bar from '../../components/StatusBar'
import Likecomments from '../../components/Likecomments'
import PostCommentReply from '../../components/PostCommentReply'
import CommentReplies from '../../components/CommentReplies'
import Header from '../../components/Header'
import CommentsScreenNewComment from '../../components/CommentsScreenNewComment'

const ViewReelsComments = () => {
  const { userProfile, showExpand, setShowExpand, setReplyCommentProps } = useAuth()
  const navigation = useNavigation()
  const route = useRoute()

  const { comment } = route.params

  const [scrrenComment, setScrrenComment] = useState(null)

  navigation.addListener('blur', () => {
    setShowExpand(true)
  })

  useEffect(() => {
    setReplyCommentProps(comment)
  }, [])

  useEffect(() => {
    setShowExpand(false)
  }, [])

  useEffect(() => {
    (async () => {
      const x = await (await getDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id))).data()
      setScrrenComment(x)
    })()
  }, [comment])

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
            source={{ uri: scrrenComment?.user?.photoURL }}
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
                @{scrrenComment?.user?.username}
              </Text>
              <Text
                style={{
                  color: userProfile?.theme == 'dark' ? color.white : color.dark
                }}
              >
                {scrrenComment?.comment}
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
                <Likecomments textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={scrrenComment} />

                {/* <PostCommentReply textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={scrrenComment} /> */}
              </View>

              {/* <CommentReplies showAll={true} backgroundColor={userProfile?.theme == 'dark' ? color.dark : color.offWhite} textColor={userProfile?.theme == 'dark' ? color.white : color.dark} comment={comment} /> */}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* <CommentsScreenNewComment defaultType={route.name == 'ViewReelsComments' ? 'reply' : 'comment'} post={comment?.post} /> */}
    </View>
  )
}

export default ViewReelsComments