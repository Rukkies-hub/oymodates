import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react'

import { View, TouchableOpacity } from 'react-native'

import { Video } from 'expo-av'
import color from '../style/color'
import { useNavigation } from '@react-navigation/native'

export const PostSingle = forwardRef(({ item }, parentRef) => {
  const ref = useRef(null)

  const navigation = useNavigation()

  const [videoStatus, setVideoStatus] = useState({})

  useImperativeHandle(parentRef, () => ({
    play,
    unload,
    stop
  }))

  useEffect(() =>
    navigation.addListener('blur', () => {
      ref.current.stopAsync()
      return () => unload()
    })
    , [navigation])

  useEffect(() => {
    return () => unload()
  }, [])

  const play = async () => {
    if (ref.current == null) return

    const status = await ref.current.getStatusAsync()
    if (status?.isPlaying) return

    try {
      await ref.current.playAsync()
    } catch (e) { }
  }
  const stop = async () => {
    if (ref.current == null) return

    const status = await ref.current.getStatusAsync()
    if (!status?.isPlaying) return

    try {
      await ref.current.stopAsync()
    } catch (e) { }
  }

  const unload = async () => {
    if (ref.current == null) return

    try {
      await ref.current.unloadAsync()
    } catch (e) { }
  }

  return (
    <View
      style={{
        position: 'relative',
        flex: 1
      }}
    >
      <TouchableOpacity
        onPress={() => videoStatus.isPlaying ? ref.current.pauseAsync() : ref.current.playAsync()}
        style={{
          flex: 1,
          backgroundColor: color.transparent,
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          height: '100%',
        }}
      />
      <Video
        ref={ref}
        style={{ flex: 1, backgroundColor: color.black }}
        resizeMode={Video.RESIZE_MODE_COVER}
        isLooping
        usePoster
        posterSource={{ uri: item?.thumbnail }}
        posterStyle={{ resizeMode: 'cover', height: '100%' }}
        shouldPlay={false}
        source={{ uri: item?.media }}
        onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
      />
    </View>
  )
})

export default PostSingle