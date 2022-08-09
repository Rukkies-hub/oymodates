import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import color from '../style/color'

import { addDoc, collection, deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import { useFonts } from 'expo-font'

const LikeReelsComment = ({ comment, reelId }) => {
  const { user, userProfile } = useAuth()

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: comment?.likesCount })
  const [disable, setDisable] = useState(false)

  useEffect(() => {
    (() => {
      getLikesById(comment?.id, user?.uid == undefined ? user?.user?.uid : user?.uid)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
  }, [])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', user?.uid == undefined ? user?.user?.uid : user?.uid))
      .then(res => resolve(res?.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      setDisable(true)
      await deleteDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', user?.uid == undefined ? user?.user?.uid : user?.uid))
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(-1)
      })
      setDisable(false)
    } else {
      setDisable(true)
      await setDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', user?.uid == undefined ? user?.user?.uid : user?.uid), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName,
        username: userProfile?.username,
      })
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(1)
      })
    }

    setDisable(false)

    if (comment?.user?.id != userProfile?.id) {
      const reel = await (await getDoc(doc(db, 'reels', comment?.reel?.id))).data()

      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'reel',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: reelId,
        seen: false,
        reel,
        user: { id: userProfile?.id },
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
      disabled={disable}
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
            color: currentLikesState?.state ? color.red : color.white,
            fontFamily: 'text',
            marginRight: 3
          }}
        >
          {currentLikesState.counter}
        </Text>
      }
      <Text
        style={{
          color: currentLikesState?.state ? color.red : color.white,
          fontFamily: 'text'
        }}
      >
        {currentLikesState.counter <= 1 ? 'Like' : 'Likes'}
      </Text>
    </TouchableOpacity>
  )
}

export default LikeReelsComment
// for reels