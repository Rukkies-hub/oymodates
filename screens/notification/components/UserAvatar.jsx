import { Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const UserAvatar = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <Image
      source={{ uri: userInfo?.photoURL }}
      style={{
        width: 45,
        height: 45,
        borderRadius: 50
      }}
    />
  )
}

export default UserAvatar
// in use