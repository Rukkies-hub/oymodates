import { addDoc, collection } from 'firebase/firestore'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { db } from '../hooks/firebase'
import color from '../style/color'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import useAuth from '../hooks/useAuth'

const NewComment = (params) => {
  const { userProfile } = useAuth()
  const post = params?.post

  const [height, setHeight] = useState(50)
  const [input, setInput] = useState('')

  const sendComment = () => {
    if (input != '')
      addDoc(collection(db, 'posts', post.id, 'comments'), {
        comment: input,
        user: userProfile
      })
    setInput('')
  }

  return (
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
        position: 'relative'
      }}
    >
      <TextInput
        multiline
        value={input}
        onChangeText={setInput}
        onSubmitEditing={sendComment}
        placeholder='Write a comment...'
        onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
        style={{
          fontSize: 18,
          flex: 1,
          width: '100%',
          height,
          maxHeight: 150,
          fontFamily: 'text',
          color: color.lightText,
          paddingRight: 40,
          paddingVertical: 5
        }}
      />

      <TouchableOpacity
        onPress={sendComment}
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
  )
}

export default NewComment