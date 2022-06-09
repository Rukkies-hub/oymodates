import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard, Dimensions } from 'react-native'

import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import color from '../style/color'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import useAuth from '../hooks/useAuth'
import { useFonts } from 'expo-font'

const NewComment = (params) => {
  const { userProfile } = useAuth()
  const post = params?.post

  const [height, setHeight] = useState(50)
  const [input, setInput] = useState('')

  const sendComment = async () => {
    if (input != '')
      addDoc(collection(db, 'posts', post?.id, 'comments'), {
        comment: input,
        post,
        likesCount: 0,
        repliesCount: 0,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL,
          username: userProfile?.username,
        },
        timestamp: serverTimestamp()
      }).then(async () => {
        if (post?.user?.id != userProfile?.id)
          await addDoc(collection(db, 'users', post?.user?.id, 'notifications'), {
            action: 'post',
            activity: 'comments',
            text: 'commented on your post',
            notify: post?.user,
            id: post?.id,
            seen: false,
            post,
            user: {
              id: userProfile?.id,
              username: userProfile?.username,
              displayName: userProfile?.displayName,
              photoURL: userProfile?.photoURL
            },
            timestamp: serverTimestamp()
          })
      })

    await updateDoc(doc(db, 'posts', post?.id), {
      commentsCount: increment(1)
    })

    setInput('')
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
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
        value={input}
        onChangeText={setInput}
        onSubmitEditing={sendComment}
        placeholder='Write a comment...'
        placeholderTextColor={userProfile?.appMode == 'light' ? color.lightText : color.white}
        onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
        style={{
          fontSize: 18,
          flex: 1,
          width: '100%',
          height,
          minHeight: 50,
          maxHeight: 150,
          fontFamily: 'text',
          color: userProfile?.appMode == 'light' ? color.dark : color.white,
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
          color={userProfile?.appMode == 'light' ? color.lightText : color.white}
          size={20}
        />
      </TouchableOpacity>
    </View>
  )
}

export default NewComment