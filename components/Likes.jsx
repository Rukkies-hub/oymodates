import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { AntDesign } from '@expo/vector-icons'
import { throttle } from 'throttle-debounce'

const Likes = (params) => {
  const { user, setLikes, likes, userProfile } = useAuth()
  const post = params?.post

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: post?.likesCount })

  useEffect(() => {
    getLikesById(post?.id, user.uid).then(res => {
      console.log({ res })
      setCurrentLikesState({
        ...currentLikesState,
        state: res
      })
    })
  }, [])

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'posts', post?.id, 'likes', user?.uid))
      await updateDoc(doc(db, 'posts', post?.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'posts', post?.id, 'likes', user?.uid), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName
      })
      await updateDoc(doc(db, 'posts', post?.id), {
        likesCount: increment(1)
      })
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
      style={{
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
      }}
    >
      <AntDesign name={currentLikesState.state ? 'heart' : 'hearto'} size={24} color={currentLikesState.state ? color.red : color.lightText} />
    </TouchableOpacity>
  )
}

export default Likes