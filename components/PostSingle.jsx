import React, { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

import { View, Text } from 'react-native'

import { Video } from 'expo-av'
import color from '../style/color'
import { useNavigation } from '@react-navigation/native'

export const PostSingle = forwardRef(({ item }, parentRef) => {
  const ref = useRef(null)

  const navigation = useNavigation()

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
    } catch (e) {
      console.log(e)
    }
  }
  const stop = async () => {
    if (ref.current == null) return

    const status = await ref.current.getStatusAsync()
    if (!status?.isPlaying) return

    try {
      await ref.current.stopAsync()
    } catch (e) {
      console.log(e)
    }
  }

  const unload = async () => {
    if (ref.current == null) return

    try {
      await ref.current.unloadAsync()
    } catch (e) {
      console.log(e)
    }
  }

  return (
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
    />
  )
})

export default PostSingle