import React, { useState } from 'react'
import { Dimensions, Text, View, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'

const { width } = Dimensions.get('window')

import useAuth from '../hooks/useAuth'
import color from '../style/color'

const PostText = ({ post }) => {
  const { userProfile } = useAuth()

  const [more, setMore] = useState(500)

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <TouchableOpacity
      onPress={() => more <= 500 ? setMore(1000000) : setMore(500)}
      activeOpacity={1}
      style={{
        width,
        padding: 10,
        paddingBottom: 0,
        marginBottom: -10
      }}
    >
      <Text
        style={{
          fontSize: post?.caption.length <= 120 ? 30 : 18,
          color: userProfile?.theme == 'dark' ? color.white : color.dark
        }}
      >
        {post?.caption?.slice(0, more)}{post?.caption.length >= 500 ? '...' : null}
      </Text>
      <Text
        style={{
          fontFamily: 'text'
        }}
      >
        {post?.caption.length >= 500 ? 'Read more' : null}
      </Text>
    </TouchableOpacity>
  )
}

export default PostText