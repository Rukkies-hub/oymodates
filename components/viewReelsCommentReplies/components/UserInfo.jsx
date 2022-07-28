import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import color from '../../../style/color'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import useAuth from '../../../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { useFonts } from 'expo-font'

const UserInfo = ({ user }) => {
  const { userProfile } = useAuth()
  const navigation = useNavigation()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  const [loaded] = useFonts({
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <TouchableOpacity
      style={{marginRight: 5}}
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
        {userInfo?.username}
      </Text>
    </TouchableOpacity>
  )
}

export default UserInfo
// in use