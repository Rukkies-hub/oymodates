import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { useIsFocused } from '@react-navigation/core'
import color from '../style/color'
import { async } from '@firebase/util'

const PostCamera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [hasAudioPermission, setHasAudioPermission] = useState(false)
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
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

      const galleryStatus = await ImagePicker?.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus?.status === 'granted')

      if (galleryStatus.status === 'granted') {
        const userGalleryMadia = await MediaLibrary?.getAssetsAsync({ sortBy: ['creationTime'], mediaType: ['video', 'photo'] })
        setGalleryItems(userGalleryMadia)
      }
    })()
  }, [])

  if (!hasCameraPermission || !hasAudioPermission || !hasGalleryPermission)
    return (
      <View></View>
    )

  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const options = { maxDuration: 60, quality: Camera?.Constants?.VideoQuality['480'] }
        const videoRecordPromise = cameraRef?.recordAsync(options)

        if (videoRecordPromise) {
          const data = await videoRecordPromise
          const source = data.uri

          console.log(source)
        }
      } catch (error) {
        console.warn('Oymo camera error: ', error)
      }
    }
  }

  const stopVideo = async () => {
    if (cameraRef) {
      cameraRef.stopRecording()
    }
  }


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.red,
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
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
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
          >

          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default PostCamera