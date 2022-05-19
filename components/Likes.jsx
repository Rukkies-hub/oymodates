import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { AntDesign } from '@expo/vector-icons'

const Likes = (params) => {
  const { user, setLikes, likes, userProfile } = useAuth()
  const post = params?.post

  const likePost = async () => {
    await updateDoc(doc(db, 'posts', post?.id), {
      likes: arrayUnion(user?.uid)
    })

    getLikes(post)
  }


  const dislikePost = async () => {
    await updateDoc(doc(db, 'posts', post.id), {
      likes: arrayRemove(user?.uid)
    })

    getLikes(post)
  }

  const getLikes = async (post) => {
    let docSnap = await (await getDoc(doc(db, 'posts', post.id))).data()

    setLikes(docSnap)
  }

  return (
    <>
      {
        post?.likes?.includes(user.uid) &&
        <TouchableOpacity
          onPress={dislikePost}
          style={{
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20
          }}
        >
          <AntDesign name="heart" size={24} color={color.red} />
        </TouchableOpacity>
      }
      {
        !post?.likes?.includes(user.uid) &&
        <TouchableOpacity
          onPress={likePost}
          style={{
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20
          }}
        >
          <AntDesign name="hearto" size={24} color={color.lightText} />
        </TouchableOpacity>
      }
    </>
  )
}

export default Likes