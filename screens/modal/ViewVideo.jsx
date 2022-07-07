import React, { useRef, useState } from 'react'
import { View, Dimensions, Pressable } from 'react-native'
import color from '../../style/color'
import { Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'

const ViewVideo = (props) => {
  const video = props?.route?.params?.video
  const videoRef = useRef(null)
  const navigation = useNavigation()
  const [status, setStatus] = useState({})

  navigation.addListener('blur', () => videoRef?.current?.stopAsync())

  return (
    <View
      style={{
        backgroundColor: color.labelColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => status?.isPlaying ? videoRef?.current?.pauseAsync() : videoRef?.current?.playAsync()}
      >
        <Video
          ref={videoRef}
          source={{ uri: video }}
          resizeMode='contain'
          style={{
            flex: 1,
            minWidth: Dimensions.get('window').width,
            minHeight: 300,
            borderRadius: 20
          }}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </Pressable>
    </View>
  )
}

export default ViewVideo