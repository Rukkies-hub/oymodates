import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import color from '../../../style/color'

const Reply = ({ user, reply }) => {
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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
    >
      <TouchableOpacity
        onPress={() => {
          user != userProfile?.id ?
            navigation.navigate('UserProfile', { user: userInfo }) :
            navigation.navigate('Profile')
        }}
      >
        <Text
          style={{
            color: color.white,
            fontFamily: 'boldText',
            fontSize: 14
          }}
        >
          @{userInfo?.username}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          color: color.white
        }}
      >
        {reply}
      </Text>
    </View>
  )
}

export default Reply
// in use