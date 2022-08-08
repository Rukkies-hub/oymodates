import { Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const Avatar = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', user),
      doc => setUserInfo(doc?.data()))
    return unsub
  }, [])

  return (
    <Image
      source={{ uri: userInfo?.photoURL }}
      style={{
        width: 100,
        height: 100,
        borderRadius: 100
      }}
    />
  )
}

export default Avatar