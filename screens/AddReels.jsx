import React, { useEffect, useState, useLayoutEffect } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native'

import { Camera } from 'expo-camera'

import { Audio } from 'expo-av'

import { useIsFocused } from '@react-navigation/core'

import color from '../style/color'

import { useNavigation } from '@react-navigation/native'

import * as ImagePicker from 'expo-image-picker'

import * as MediaLibrary from 'expo-media-library'

import { MaterialIcons, Entypo } from '@expo/vector-icons'

import Bar from '../components/StatusBar'

import * as VideoThumbnails from 'expo-video-thumbnails'

import useAuth from '../hooks/useAuth'

import * as NavigationBar from 'expo-navigation-bar'

const AddReels = () => {
  const navigation = useNavigation()
  const { userProfile } = useAuth()

  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [hasAudioPermission, setHasAudioPermission] = useState(false)
  const [hasGalleryPermission, setHasGalleryPermissions] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
  const [cameraRef, setCameraRef] = useState(null)
  const [cameraType, setCameraType] = useState(Camera?.Constants?.Type?.back)
  const [cameraFlash, setCameraFlash] = useState(Camera?.Constants?.FlashMode?.off)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const isFocused = useIsFocused()

  if (isFocused) {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }

  navigation.addListener('blur', () => {
    NavigationBar.setVisibilityAsync('visible')
  })

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera?.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus?.status === 'granted')

      const audioStatus = await Audio.requestPermissionsAsync()
      setHasAudioPermission(audioStatus?.status === 'granted')

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermissions(galleryStatus?.status === 'granted')

      if (galleryStatus?.status == 'granted') {
        const userGalleryMedia = await MediaLibrary.getAssetsAsync({
          sortBy: ['creationTime'],
          mediaType: ['video']
        })
        setGalleryItems(userGalleryMedia.assets)
      }
    })()
  }, [])

  const recordVideo = async () => {
    if (cameraRef)
      try {
        const options = { maxDuration: 30, quality: Camera?.Constants?.VideoQuality['480'] }
        const videoRecordPromise = cameraRef?.recordAsync(options)

        if (videoRecordPromise) {
          const data = await videoRecordPromise
          const source = data?.uri
          let thumbnail = await generateThumbnail(source)
          if (thumbnail)
            navigation.navigate('SaveReels', { source, thumbnail })
        }
      } catch (error) {
        console.warn(error)
      }
  }

  const stopVideo = async () => {
    if (cameraRef) cameraRef.stopRecording()
  }

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      videoMaxDuration: 30
    })

    if (!result.cancelled) {
      let source = result.uri
      let thumbnail = await generateThumbnail(source)
      if (thumbnail)
        navigation.navigate('SaveReels', { source, thumbnail })
    }
  }

  const generateThumbnail = async (source) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        source,
        {
          time: 1000,
        }
      )
      return uri
    } catch (e) {
      console.warn(e)
    }
  }

  if (!hasCameraPermission || !hasAudioPermission || !hasGalleryPermission) {
    return (
      <View></View>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />
      
      {
        isFocused ?
          <Camera
            ref={ref => setCameraRef(ref)}
            ratio={'16:9'}
            type={cameraType}
            flashMode={cameraFlash}
            onCameraReady={() => setIsCameraReady(true)}
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
          <MaterialIcons name='flip-camera-android' size={24} color={color.white} />
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
          <MaterialIcons name='bolt' size={24} color={color.white} />
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
        <View style={{ flex: 1 }} />
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
              borderColor: color.faintRed,
              backgroundColor: color.red,
              borderRadius: 100,
              width: 80,
              height: 80,
              alignSelf: 'center'
            }}
          />
        </View>

        <View
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            onPress={pickFromGallery}
            style={{
              borderWidth: 2,
              borderColor: color.white,
              borderRadius: 12,
              overflow: 'hidden',
              width: 50,
              height: 50
            }}
          >
            {
              galleryItems[0] == undefined ?
                <></> :
                <Image
                  source={{ uri: galleryItems[0].uri }}
                  style={{
                    width: 50,
                    height: 50
                  }}
                />
            }
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddReels