import React, { useRef, useState, useEffect } from 'react'
import { View, useWindowDimensions, TouchableOpacity, Dimensions } from 'react-native'

import color from '../style/color'

import { Video } from 'expo-av'

import { Feather } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

import { useNavigation } from '@react-navigation/native'

const PostVideo = (props) => {
  const navigation = useNavigation()
  const post = props?.post
  const windowWidth = useWindowDimensions().width

  const [status, setStatus] = useState({})

  const video = useRef(null)

  useEffect(() =>
    (() => {
      navigation.addListener('blur', () => {
        video?.current?.stopAsync()
        return () => unload()
      })
    })()
    , [navigation])

  return (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        width: windowWidth,
        position: 'relative',
        backgroundColor: color.black
      }}
    >
      <Video
        isLooping
        ref={video}
        style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'center',
          width: windowWidth,
          aspectRatio: 1,
        }}
        source={{
          uri: post?.media,
        }}
        useNativeControls={false}
        resizeMode='cover'
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />

      <TouchableOpacity
        onPress={() => status.isPlaying ? video?.current?.pauseAsync() : video?.current?.playAsync()}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {
          !status.isPlaying &&
          <Feather name='play' size={60} color={color.white} />
        }
      </TouchableOpacity>
    </View>
  )
}

export default PostVideo