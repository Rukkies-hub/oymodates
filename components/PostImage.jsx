import React from 'react'
import { Dimensions } from 'react-native'

import AutoHeightImage from 'react-native-auto-height-image'

import DoubleClick from 'react-native-double-tap-without-opacity'

const { width } = Dimensions.get('window')

import CachAutoHeightImage from './CachAutoHeightImage'

const PostImage = (props) => {
  const post = props?.post

  return (
    <DoubleClick delay={200}>
      <CachAutoHeightImage url={post?.media} width={width} resizeMode='cover' style={{ flex: 1 }} />
    </DoubleClick>
  )
}

export default PostImage