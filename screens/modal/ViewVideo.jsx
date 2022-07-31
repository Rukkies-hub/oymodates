import React, { useRef, useState } from 'react'
import { View, Dimensions, Pressable, ImageBackground, TouchableOpacity } from 'react-native'
import color from '../../style/color'
import { Video } from 'expo-av'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const ViewVideo = (props) => {
  // const video = props?.route?.params?.video
  const { video, thumbnail } = useRoute().params
  const videoRef = useRef(null)
  const navigation = useNavigation()
  const [status, setStatus] = useState({})

  navigation.addListener('blur', () => videoRef?.current?.stopAsync())

  return (
    <ImageBackground
      source={{ uri: thumbnail }}
      blurRadius={50}
      style={{
        backgroundColor: color.labelColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          marginHorizontal: 30,
          width: 50,
          height: 50,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: `${color.dark}89`,
          zIndex: 1
        }}
      >
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => status?.isPlaying ? videoRef?.current?.pauseAsync() : videoRef?.current?.playAsync()}
      >
        <Video
          ref={videoRef}
          source={{ uri: video }}
          resizeMode='contain'
          usePoster
          posterSource={{ uri: thumbnail }}
          posterStyle={{
            resizeMode: 'contain',
            height: '100%',
            overflow: 'hidden'
          }}
          style={{
            flex: 1,
            minWidth: width,
            minHeight: 300
          }}
          isPlaying={true}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </Pressable>
    </ImageBackground>
  )
}

export default ViewVideo
// in use