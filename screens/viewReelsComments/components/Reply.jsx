import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import color from '../../../style/color'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useFonts } from 'expo-font'

const { width } = Dimensions.get('window')

const Reply = ({ user, comment }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        marginLeft: 10,
        backgroundColor: color.lightBorderColor,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        maxWidth: width - 55
      }}
    >
      <Text
        style={{
          color: color.white,
          fontFamily: 'text',
          fontSize: 13
        }}
      >
        @{userInfo?.username}
      </Text>
      <Text
        style={{
          color: color.white
        }}
      >
        {comment}
      </Text>
    </View>
  )
}

export default Reply
// in use