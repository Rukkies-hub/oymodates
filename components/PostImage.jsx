import React from 'react'
import { Dimensions } from 'react-native'

import DoubleClick from 'react-native-double-tap-without-opacity'

const { width } = Dimensions.get('window')

import CacheImage from 'expo-cache-image'

const PostImage = (props) => {
  const post = props?.post

  return (
    <DoubleClick delay={200}>
      <CacheImage url={post?.media} type='autoHeight' width={width} resizeMode='cover' style={{ flex: 1 }} />
    </DoubleClick>
  )
}

export default PostImage