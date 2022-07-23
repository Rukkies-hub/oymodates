import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

const ReelsCommentReplyReply = ({ reply }) => {
  const { setReelsCommentType, setReplyCommentProps } = useAuth()

  return (
    <TouchableOpacity
      onPress={() => {
        setReelsCommentType('replyReply')
        setReplyCommentProps(reply)
      }}
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
  )
}

export default ReelsCommentReplyReply