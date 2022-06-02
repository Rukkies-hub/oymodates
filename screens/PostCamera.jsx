import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { Camera } from 'expo-camera'

import { Audio } from 'expo-av'

import { useIsFocused } from '@react-navigation/core'

import color from '../style/color'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'

const PostCamera = () => {
  const navigation = useNavigation()
  const { setMedia, madiaString } = useAuth()

  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [hasAudioPermission, setHasAudioPermission] = useState(false)
  const [cameraRef, setCameraRef] = useState(null)
  const [cameraType, setCameraType] = useState(Camera?.Constants?.Type?.front)
  const [cameraFlash, setCameraFlash] = useState(Camera?.Constants?.FlashMode?.off)
  const [isCameraReady, setIscameraReady] = useState(false)

  const isFocused = useIsFocused()

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera?.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus?.status === 'granted')

      const audioStatus = await Audio?.requestPermissionsAsync()
      setHasAudioPermission(audioStatus?.status === 'granted')
    })()
  }, [])

  if (!hasCameraPermission || !hasAudioPermission)
    return (
      <View></View>
    )

  const recordVideo = async () => {
    if (cameraRef)
      try {
        const options = { maxDuration: 30, quality: Camera?.Constants?.VideoQuality['480'] }
        const videoRecordPromise = cameraRef?.recordAsync(options)

        if (videoRecordPromise) {
          const data = await videoRecordPromise
          const source = data?.uri

          setMedia(source)
          navigation.goBack()
        }
      } catch (error) {
        console.warn('Oymo camera error: ', error)
      }
  }

  const stopVideo = async () => {
    if (cameraRef) cameraRef.stopRecording()
  }

  const takePictire = async () => {
    if (cameraRef) {
      const data = await cameraRef?.takePictureAsync(null)
      setMedia(data?.uri)
      navigation.goBack()
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.black,
        position: 'relative'
      }}
    >
      {
        isFocused ?
          <Camera
            ref={ref => setCameraRef(ref)}
            ratio={'16:9'}
            type={cameraType}
            flashMode={cameraFlash}
            onCameraReady={() => setIscameraReady(true)}
            style={{
              flex: 1,
              backgroundColor: color.black,
              aspectRatio: 9 / 16
            }}
          />
          : null
      }

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
          backgroundColor: `${color.dark}89`
        }}
      >
        <FontAwesome5 name='chevron-left' size={20} color={color.white} />
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          top: 60,
          right: 0,
          marginHorizontal: 20
        }}
      >
        <TouchableOpacity
          onPress={
            () => setCameraType(
              cameraType === Camera?.Constants?.Type?.back ?
                Camera?.Constants?.Type?.front : Camera?.Constants?.Type?.back
            )
          }
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            marginBottom: 25
          }}
        >
          <FontAwesome5 name='retweet' color={color.white} size={20} />
          <Text
            style={{
              color: color.white,
              fontSize: 12,
              marginTop: 5
            }}
          >
            Flip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () => setCameraFlash(
              cameraFlash === Camera?.Constants?.FlashMode?.torch ?
                Camera?.Constants?.FlashMode?.off : Camera?.Constants?.FlashMode?.torch
            )
          }
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            marginBottom: 25
          }}
        >
          <FontAwesome5 name='bolt' color={color.white} size={20} />
          <Text
            style={{
              color: color.white,
              fontSize: 12,
              marginTop: 5
            }}
          >
            Flash
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30
        }}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: 30
          }}
        >
          <TouchableOpacity
            disabled={!isCameraReady}
            onPress={takePictire}
            onLongPress={recordVideo}
            onPressOut={stopVideo}
            style={{
              borderWidth: 8,
              borderColor: `${color.red}89`,
              backgroundColor: color.red,
              borderRadius: 100,
              height: 80,
              width: 80,
              alignSelf: 'center'
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default PostCamera