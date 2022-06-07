import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, increment, onSnapshot, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { AntDesign } from '@expo/vector-icons'
import { Audio } from 'expo-av'

const Likes = (params) => {
  const { user, userProfile } = useAuth()
  const post = params?.post

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: post?.likesCount })
  const [sound, setSound] = useState()
  const [likeDisable, setLikeDisable] = useState(false)

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
    <TouchableOpacity
      onPress={handleUpdateLikes}
      disabled={likeDisable}
      style={{
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
      }}
    >
      <AntDesign name={currentLikesState.state ? 'heart' : 'hearto'} size={24} color={currentLikesState.state ? color.red : userProfile?.appMode == 'light' ? color.lightText : color.white} />
    </TouchableOpacity>
  )
}

export default Likes