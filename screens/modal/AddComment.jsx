import React from 'react'
import { View } from 'react-native'

import Header from '../../components/Header'

import color from '../../style/color'

import { useFonts } from 'expo-font'

import Comments from '../../components/Comments'
import NewComment from '../../components/NewComment'

const AddComment = params => {
  const post = params?.route?.params?.post

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showBack showTitle title='Comment' />

      <Comments post={post} />

      <NewComment post={post} />
    </View>
  )
}

export default AddComment