import { TouchableOpacity, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { SimpleLineIcons } from '@expo/vector-icons'
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
    >
      {
        userInfo?.photoURL ?
          <Image
            source={{ uri: userInfo?.photoURL }}
            style={{
              width: 25,
              height: 25,
              borderRadius: 50
            }}
          /> :
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              backgroundColor: color.faintBlack,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <SimpleLineIcons name='user' size={12} color={color.white} />
          </View>
      }
    </TouchableOpacity>
  )
}

export default UserAvatar
// in use