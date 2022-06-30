import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import useAuth from '../hooks/useAuth'
import color from '../style/color'

const ReelsCommentReply = (props) => {
  const { userProfile, setReelsCommentType, setReplyCommentProps, setCommentAutoFocus } = useAuth()

  const comment = props?.comment

  return (
    <TouchableOpacity
      onPress={() => {
        setReelsCommentType('reply')
        setReplyCommentProps(comment)
        setCommentAutoFocus(true)
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

export default ReelsCommentReply