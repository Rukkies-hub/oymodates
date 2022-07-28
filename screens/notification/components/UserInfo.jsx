import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useFonts } from 'expo-font'
import color from '../../../style/color'

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
    <Text
      style={{
        color: userProfile?.theme == 'light' ? color.dark : color.white,
        fontFamily: 'text',
        fontSize: 14
      }}
    >
      {userInfo?.username}
    </Text>
  )
}

export default UserInfo
// in use