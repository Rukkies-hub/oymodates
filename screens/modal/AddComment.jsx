import React from 'react'
import { View } from 'react-native'

import Header from '../../components/Header'

import color from '../../style/color'

import { useFonts } from 'expo-font'

import Comments from '../../components/Comments'
import NewComment from '../../components/NewComment'
import useAuth from '../../hooks/useAuth'

const AddComment = params => {
  const { userProfile } = useAuth()
  const post = params?.route?.params?.post

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
      }}
    >
      <Header showBack showTitle title='Comment' />

      <Comments post={post} />

      <NewComment post={post} />
    </View>
  )
}

export default AddComment