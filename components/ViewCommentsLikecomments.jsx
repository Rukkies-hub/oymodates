import { useFonts } from 'expo-font'
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { appToken } from '@env'
import axios from 'axios'

const ViewCommentsLikecomments = ({ comment, textColor }) => {
  const { user, userProfile } = useAuth()

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: comment?.likesCount })

  useEffect(() => {
    (() => {
      getLikesById(comment?.id, user?.uid)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
  }, [comment])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id, 'likes', user?.uid))
      .then(res => resolve(res?.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id, 'likes', user?.uid))
      await updateDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id, 'likes', user?.uid), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName,
        username: userProfile?.username,
      })
      await updateDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id), {
        likesCount: increment(1)
      })
    }

    if (comment?.user?.id != userProfile?.id) {
      const post = await (await getDoc(doc(db, 'posts', comment?.post?.id))).data()

      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'post',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: comment?.id,
        seen: false,
        post,
        user: {
          id: userProfile?.id,
          username: userProfile?.username,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL
        },
        timestamp: serverTimestamp()
      }).then(() => {
        axios.post(`https://app.nativenotify.com/api/indie/notification`, {
          subID: comment?.post?.user?.id,
          appId: 3167,
          appToken,
          title: '👍',
          message: `@${userProfile?.username} likes to your comment (${comment?.comment.slice(0, 100)})`
        })
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
              color: currentLikesState.state ? color.red : userProfile?.thme == 'dark' ? color.white : color.dark,
              fontFamily: 'text',
              marginRight: 3
            }}
          >
            {currentLikesState.counter}
          </Text>
        }
        <Text
          style={{
            color: currentLikesState.state ? color.red : userProfile?.thme == 'dark' ? color.white : color.dark,
            fontFamily: 'text'
          }}
        >
          {currentLikesState.counter <= 1 ? 'Like' : 'Likes'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ViewCommentsLikecomments