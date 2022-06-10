import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'

import AutoHeightImage from 'react-native-auto-height-image'

import DoubleClick from "react-native-double-tap-without-opacity"
import useAuth from '../hooks/useAuth'

const { width, height } = Dimensions.get('window')

import { AntDesign } from '@expo/vector-icons'
import { Audio } from 'expo-av'

import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, increment, onSnapshot, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import color from '../style/color'

const PostImage = (props) => {
  const {
    user,
    userProfile,
    currentLikesState,
    setCurrentLikesState,
    likeDisable,
    setLikeDisable
  } = useAuth()

  const post = props?.post

  const [sound, setSound] = useState()

  useEffect(() => {
    getLikesById(post?.id, user?.uid).then(res => {
      setCurrentLikesState({
        ...currentLikesState,
        state: res
      })
    })
  }, [])

  useEffect(() => {
    return sound
      ? () => sound.unloadAsync()
      : undefined
  }, [sound])

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/like.wav')
    )
    setSound(sound)

    sound.setVolumeAsync(0.1)
    await sound.playAsync()
  }

  const updateLike = () => new Promise(async (resolve, reject) => {
    setLikeDisable(true)
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'posts', post?.id, 'likes', user?.uid))
      await updateDoc(doc(db, 'posts', post?.id), {
        likesCount: increment(-1)
      }).finally(() => setLikeDisable(false))
    } else {
      await setDoc(doc(db, 'posts', post?.id, 'likes', user?.uid), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName,
        username: userProfile?.username,
      }).then(async () => {
        playSound()
        if (post?.user?.id != user?.uid)
          await addDoc(collection(db, 'users', post?.user?.id, 'notifications'), {
            action: 'post',
            activity: 'likes',
            text: 'likes your post',
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
        likesCount: increment(1)
      }).finally(() => setLikeDisable(false))
    }
  })

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'posts', post?.id, 'likes', user?.uid))
      .then(res => resolve(res.exists()))
  })

  const handleUpdateLikes = async () => {
    setCurrentLikesState({
      state: !currentLikesState.state,
      counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    })
    updateLike()
  }

  return (
    <DoubleClick
      doubleTap={handleUpdateLikes}
      delay={200}
    >
      <AutoHeightImage
        source={{ uri: post?.media }}
        width={width}
        style={{ flex: 1 }}
        resizeMode='cover'
      />
    </DoubleClick>
  )
}

export default PostImage