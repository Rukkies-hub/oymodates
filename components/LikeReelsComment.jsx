import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import color from '../style/color'

import { addDoc, collection, deleteDoc, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import { useFonts } from 'expo-font'

const LikeReelsComment = (props) => {
  const { user, userProfile } = useAuth()
  const comment = props.comment

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
  }, [])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', user?.uid))
      .then(res => resolve(res.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', user?.uid))
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', user?.uid), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName,
        username: userProfile?.username,
      })
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(1)
      })
    }

    if (comment?.user?.id != userProfile?.id) {
      const reel = await (await getDoc(doc(db, 'reels', comment?.reel?.id))).data()

      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'reel',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: comment?.id,
        seen: false,
        reel,
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
            color: currentLikesState.state ? color.red : userProfile?.appMode == 'light' ? color.dark : color.white,
            fontFamily: 'text',
            marginRight: 3
          }}
        >
          {
            currentLikesState.counter
          }
        </Text>
      }
      <Text
        style={{
          color: currentLikesState.state ? color.red : userProfile?.appMode == 'light' ? color.dark : color.white,
          fontFamily: 'text'
        }}
      >
        {
          currentLikesState.counter <= 1 ? 'Like' : 'Likes'
        }
      </Text>
    </TouchableOpacity>
  )
}

export default LikeReelsComment