import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const UserAvatar = ({ user }) => {
  const { userProfile } = useAuth()
  const navigation = useNavigation()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <TouchableOpacity
      onPress={() => {
        user != userProfile?.id ?
          navigation.navigate('UserProfile', { user: userInfo }) :
          navigation.navigate('Profile')
      }}
    >
      <Image
        source={{ uri: userInfo?.photoURL }}
        style={{
          width: 25,
          height: 25,
          borderRadius: 50
        }}
      />
    </TouchableOpacity>
  )
}

export default UserAvatar
// in use