import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { AntDesign, FontAwesome } from '@expo/vector-icons'
import color from '../style/color'

import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, increment, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import useAuth from '../hooks/useAuth'
import { db } from '../hooks/firebase'
import axios from 'axios'

import { appToken } from '@env'

const LikeReels = ({ reel, navigation }) => {
  const { user, userProfile } = useAuth()

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: reel?.likesCount })
  const [disable, setDisable] = useState(false)

  useEffect(() =>
    (() => {
      getLikesById(reel?.id, userProfile?.id)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
    , [])

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      setDisable(true)
      await deleteDoc(doc(db, 'reels', reel?.id, 'likes', userProfile?.id))
      await updateDoc(doc(db, 'reels', reel?.id), {
        likesCount: increment(-1)
      })
      await updateDoc(doc(db, 'users', reel?.user?.id), {
        likesCount: increment(-1)
      })
      setDisable(false)
    } else {
      setDisable(true)
      await setDoc(doc(db, 'reels', reel?.id, 'likes', userProfile?.id), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName,
        username: userProfile?.username,
      })
      await updateDoc(doc(db, 'reels', reel?.id), {
        likesCount: increment(1)
      })
      await updateDoc(doc(db, 'users', reel?.user?.id), {
        likesCount: increment(1)
      })
      setDisable(false)
      if (reel?.user?.id != userProfile?.id)
        await addDoc(collection(db, 'users', reel?.user?.id, 'notifications'), {
          action: 'reel',
          activity: 'likes',
          text: 'likes your post',
          notify: reel?.user,
          id: reel?.id,
          seen: false,
          reel,
          user: { id: userProfile?.id },
          timestamp: serverTimestamp()
        }).then(() => {
          axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: reel?.user?.id,
            appId: 3167,
            appToken,
            title: 'Oymo',
            message: `@${userProfile?.username} likes to your comment (${reel?.description?.slice(0, 100)})`
          })
        })
    }
  })

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', reel?.id, 'likes', userProfile?.id))
      .then(res => resolve(res?.exists()))
  })

  const handleUpdateLikes = async () => {
    setCurrentLikesState({
      state: !currentLikesState.state,
      counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    })
    updateLike()
  }

  const disabled = () => navigation.navigate('SetupModal')

  return (
    <TouchableOpacity
      onPress={() => userProfile ? handleUpdateLikes() : disabled()}
      disabled={disable}
      style={{
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
      }}
    >
      <AntDesign name='heart' size={24} color={currentLikesState.state ? color.red : color.white} />
      <Text
        style={{
          color: color.white,
          fontFamily: 'text',
          marginTop: 5
        }}
      >
        {currentLikesState.counter ? currentLikesState.counter : '0'}
      </Text>
    </TouchableOpacity>
  )
}

export default LikeReels
// for reels