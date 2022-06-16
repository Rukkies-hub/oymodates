import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

const ReelsCommentReplyReply = (props) => {
  const { userProfile, setReelsCommentType, setReplyCommentProps, setCommentAutoFocus } = useAuth()

  const reply = props?.reply

  return (
    <TouchableOpacity
      onPress={() => {
        setReelsCommentType('replyReply')
        setReplyCommentProps(reply)
        setCommentAutoFocus(true)
      }}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 2
      }}
    >
      <Text
        style={{
          color: userProfile?.appMode == 'light' ? color.dark : color.white,
          fontFamily: 'text'
        }}
      >
        Reply
      </Text>
    </TouchableOpacity>
  )
}

export default ReelsCommentReplyReply