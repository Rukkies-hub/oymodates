import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { useFonts } from 'expo-font'
import useAuth from '../hooks/useAuth'

import { addDoc, collection, deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import color from '../style/color'

const LikeReply = ({ reply, textColor, screen }) => {
  const { user, userProfile } = useAuth()

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: reply?.likesCount })

  useEffect(() => {
    (() => {
      getLikesById(reply.id, user?.uid)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
  }, [])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'posts', reply?.post?.id, 'comments', reply?.comment, 'replies', reply?.id, 'likes', user?.uid))
      .then(res => resolve(res?.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'posts', reply?.post?.id, 'comments', reply?.comment, 'replies', reply?.id, 'likes', user?.uid))
      await updateDoc(doc(db, 'posts', reply?.post?.id, 'comments', reply?.comment, 'replies', reply?.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'posts', reply?.post?.id, 'comments', reply?.comment, 'replies', reply?.id, 'likes', user?.uid), {
        id: userProfile?.id,
        comment: reply?.comment,
        reply: reply?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName,
        username: userProfile?.username,
      })
      await updateDoc(doc(db, 'posts', reply?.post?.id, 'comments', reply?.comment, 'replies', reply?.id), {
        likesCount: increment(1)
      })
    }

    if (reply?.post?.user?.id != userProfile?.id) {
      await addDoc(collection(db, 'users', reply?.post?.user?.id, 'notifications'), {
        action: 'post',
        activity: 'reply likes',
        text: 'likes your reply',
        notify: reply?.post?.user,
        id: reply?.comment,
        seen: false,
        post: reply?.post,
        user: {
          id: userProfile?.id,
          username: userProfile?.username,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL
        },
        timestamp: serverTimestamp()
      })
    }
  })

  const handleUpdateLikes = () => {
    setCurrentLikesState({
      state: !currentLikesState.state,
      counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    })
    updateLike()
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View>
      <TouchableOpacity
        onPress={handleUpdateLikes}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 2,
          marginRight: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        {
          currentLikesState.counter > 0 &&
          <Text
            style={{
              color: currentLikesState?.state ? color.red : screen ? screen : textColor || userProfile?.theme == 'dark' ? color.white : color.dark,
              fontFamily: 'text',
              marginRight: 3
            }}
          >
            {currentLikesState.counter}
          </Text>
        }
        <Text
          style={{
            color: currentLikesState?.state ? color.red : screen ? screen : textColor || userProfile?.theme == 'dark' ? color.white : color.dark,
            fontFamily: 'text'
          }}
        >
          {currentLikesState.counter <= 1 ? 'Like' : 'Likes'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default LikeReply