import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import { useFonts } from 'expo-font'

const Username = ({ user }) => {
  const { theme } = useAuth()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  const [loaded] = useFonts({
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <Text
      style={{
        fontFamily: 'boldText',
        fontSize: 20,
        color: theme == 'light' ? color.dark : color.white
      }}
    >
      {userInfo?.username}
    </Text>
  )
}

export default Username
// in use