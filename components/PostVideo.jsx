import React, { useRef, useState, useEffect } from 'react'
import { View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'

import color from '../style/color'

import { Video } from 'expo-av'

import { Feather } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

import { useNavigation } from '@react-navigation/native'

const PostVideo = (props) => {
  const navigation = useNavigation()
  const post = props?.post

  const [status, setStatus] = useState({})

  const video = useRef(null)

  navigation.addListener('blur', () => {
    video?.current?.stopAsync()
    return () => unload()
  })

  return (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        width,
        position: 'relative',
        backgroundColor: color.black
      }}
    >
      <ImageBackground
        source={{ uri: post?.thumbnail ? post?.thumbnail : null }}
        blurRadius={50}
        style={{
          width
        }}
      >
        <Video
          isLooping
          ref={video}
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            width: post?.mediaSize ? post?.mediaSize?.width : width,
            aspectRatio: 1,
          }}
          source={{
            uri: post?.media,
          }}
          usePoster
          posterSource={{ uri: post?.thumbnail }}
          posterStyle={{
            resizeMode: 'contain',
            height: '100%'
          }}
          useNativeControls={false}
          resizeMode='contain'
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </ImageBackground>

      <TouchableOpacity
        onPress={() => status?.isPlaying ? video?.current?.pauseAsync() : video?.current?.playAsync()}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {
          !status?.isPlaying &&
          <Feather name='play' size={60} color={color.white} />
        }
      </TouchableOpacity>
    </View>
  )
}

export default PostVideo