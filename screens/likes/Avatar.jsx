import { Dimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { SimpleLineIcons } from '@expo/vector-icons'
import useAuth from '../../hooks/useAuth'
import color from '../../style/color'
import AutoHeightImage from 'react-native-auto-height-image'

const { width } = Dimensions.get('window')

const Avatar = ({ user }) => {
  const { theme } = useAuth()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (() => {
      onSnapshot(doc(db, 'users', user),
        doc => setUserInfo(doc?.data()))
    })()
  }, [])

  return (
    <>
      {
        userInfo?.photoURL ?
          <AutoHeightImage
            source={{ uri: userInfo?.photoURL }}
            width={(width / 3.5)}
            style={{
              maxHeight: 250,
              borderRadius: 12
            }}
          /> :
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite
            }}
          >
            <SimpleLineIcons name='user' size={20} color={theme == 'dark' ? color.white : color.dark} />
          </View>
      }
    </>
  )
}

export default Avatar