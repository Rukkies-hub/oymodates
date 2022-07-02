import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import useAuth from '../hooks/useAuth'
import color from '../style/color'

const PostCommentReplyReply = ({ comment, textColor }) => {
  const { setPostCommentType, setReplyCommentProps } = useAuth()

  return (
    <TouchableOpacity
      onPress={() => {
        setPostCommentType('replyReply')
        setReplyCommentProps(comment)
      }}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 2
      }}
    >
      <Text
        style={{
          color: textColor || color.white,
          fontFamily: 'text'
        }}
      >
        Reply
      </Text>
    </TouchableOpacity>
  )
}

export default PostCommentReplyReply