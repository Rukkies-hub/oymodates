import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

const Likecomments = (props) => {
  const { user, userProfile } = useAuth()
  const comment = props.comment

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: comment?.likesCount })

  useEffect(() => {
    getLikesById(comment.id, user.uid)
      .then(res => {
        console.log({ res })
        setCurrentLikesState({
          ...currentLikesState,
          state: res
        })
      })
  }, [])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'posts', comment?.post, 'comments', comment?.id, 'likes', user.uid))
      .then(res => resolve(res.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'posts', comment?.post, 'comments', comment?.id, 'likes', user.uid))
      await updateDoc(doc(db, 'posts', comment?.post, 'comments', comment?.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'posts', comment?.post, 'comments', comment?.id, 'likes', user.uid), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        displayName: userProfile?.displayName
      })
      await updateDoc(doc(db, 'posts', comment?.post, 'comments', comment?.id), {
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
        <Text
          style={{
            color: currentLikesState.state ? color.red : color.dark,
            marginRight: 5
          }}
        >
          {currentLikesState.counter}
        </Text>
        <Text
          style={{
            color: color.dark
          }}
        >
          {
            currentLikesState.counter <= 1 ? 'Like' : 'Likes'
          }
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Likecomments