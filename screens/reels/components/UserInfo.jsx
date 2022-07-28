import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import useAuth from '../../../hooks/useAuth'
import color from '../../../style/color'
import { useFonts } from 'expo-font'

const UserInfo = ({ user, navigation }) => {
  const { userProfile } = useAuth()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <>
      {
        userProfile ?
          <TouchableOpacity
            onPress={() => userInfo?.id == userProfile?.id ? navigation.navigate('Profile') : navigation.navigate('UserProfile', { user: userInfo })}
          >
            <Text
              style={{
                color: color.white,
                fontFamily: 'text',
                fontSize: 16
              }}
            >
              {userInfo?.username}
            </Text>
          </TouchableOpacity> :
          <Text
            style={{
              color: color.white,
              fontFamily: 'text',
              fontSize: 16
            }}
          >
            {userInfo?.username}
          </Text>
      }
    </>
  )
}

export default UserInfo