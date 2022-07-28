import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import color from '../../../style/color'

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
      style={{
        width: 50,
        height: 50,
        borderWidth: 4,
        borderRadius: 100,
        borderColor: color.white,
        overflow: 'hidden'
      }}
    >
      <Image
        source={{ uri: userInfo?.photoURL }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50
        }}
      />
    </TouchableOpacity>
  )
}

export default UserAvatar
// in use