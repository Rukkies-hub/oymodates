import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'

import { Camera } from 'expo-camera'

import { Audio } from 'expo-av'

import { useIsFocused } from '@react-navigation/core'

import color from '../../style/color'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation, useRoute } from '@react-navigation/native'
import useAuth from '../../hooks/useAuth'
import Bar from '../../components/StatusBar'

import { MaterialIcons, Entypo } from '@expo/vector-icons'

const MessageCamera = () => {
  const navigation = useNavigation()
  const { setMedia, madiaString } = useAuth()

  const { params } = useRoute()
  const { matchDetails } = params

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
    return <View></View>

  const recordVideo = async () => {
    if (cameraRef)
      try {
        const options = { maxDuration: 30, quality: Camera?.Constants?.VideoQuality['480'] }
        const videoRecordPromise = cameraRef?.recordAsync(options)

        if (videoRecordPromise) {
          const data = await videoRecordPromise

          navigation.navigate('PreviewMessageImage', {
            matchDetails,
            media: {
              uri: data.uri,
              type: 'video'
            }
          })
          console.log(data)
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
      navigation.navigate('PreviewMessageImage', {
        matchDetails, media: {
          uri: data.uri,
          type: 'image'
        }
      })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Bar color={'light'} />

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
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          top: 60,
          right: 0,
          marginHorizontal: 20,
          backgroundColor: `${color.dark}89`,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 50
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
          <MaterialIcons name='flip-camera-android' color={color.white} size={24} />
          <Text
            style={{
              color: color.white,
              fontSize: 12,
              marginTop: 5,
              marginLeft: 3
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
            justifyContent: 'center'
          }}
        >
          <MaterialIcons name='bolt' color={color.white} size={24} />
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
              borderColor: color.faintRed,
              backgroundColor: color.red,
              borderRadius: 100,
              width: 80,
              height: 80,
              alignSelf: 'center'
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default MessageCamera