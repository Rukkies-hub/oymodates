import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

const LikeReelsReply = (props) => {
  const { user, userProfile } = useAuth()
  const reply = props?.reply

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: reply?.likesCount })

  useEffect(() => {
    getLikesById(reply.id, user.uid)
      .then(res => {
        setCurrentLikesState({
          ...currentLikesState,
          state: res
        })
      })
  }, [])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', reply?.reel, 'comments', reply?.comment, 'replies', reply.id, 'likes', user.uid))
      .then(res => resolve(res.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'reels', reply?.reel, 'comments', reply?.comment, 'replies', reply.id, 'likes', user.uid))
      await updateDoc(doc(db, 'reels', reply?.reel, 'comments', reply?.comment, 'replies', reply.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'reels', reply?.reel, 'comments', reply?.comment, 'replies', reply.id, 'likes', user.uid), {
        id: userProfile?.id,
        comment: reply?.comment,
        reply: reply.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName,
        username: userProfile?.username,
      })
      await updateDoc(doc(db, 'reels', reply?.reel, 'comments', reply?.comment, 'replies', reply.id), {
        likesCount: increment(1)
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
            color: currentLikesState.state ? color.red : userProfile?.appMode != 'light' ? color.dark : color.white,
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
          color: currentLikesState.state ? color.red : userProfile?.appMode != 'light' ? color.dark : color.white,
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

export default LikeReelsReply