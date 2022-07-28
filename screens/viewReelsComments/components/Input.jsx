import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import color from '../../../style/color'
import useAuth from '../../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const Input = ({ user }) => {
  const {
    reelsCommentType,
    reply,
    setReply,
    height,
    setHeight
  } = useAuth()
  
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
    <TextInput
      multiline
      value={reelsCommentType == 'reply' ? reply : reply}
      onChangeText={reelsCommentType == 'reply' ? setReply : setReply}
      placeholder={reelsCommentType == 'reply' ? `Reply @${userInfo?.username}` : `Reply @${userInfo?.username}'s comment`}
      placeholderTextColor={color.lightText}
      onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
      style={{
        fontSize: 18,
        flex: 1,
        width: '100%',
        height,
        minHeight: 50,
        maxHeight: 150,
        fontFamily: 'text',
        paddingRight: 40 + 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: color.white,
      }}
    />
  )
}

export default Input
// in use