import React, { useEffect, useState, useLayoutEffect } from 'react'
import { View, Text, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import color from '../style/color'

import Bar from '../components/StatusBar'

import { Camera, CameraType } from 'expo-camera'

import { useIsFocused } from '@react-navigation/core'

import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons'

import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window')

import { Audio } from 'expo-av'
import { useFonts } from 'expo-font'

import { useNavigation } from '@react-navigation/native'

import { io } from 'socket.io-client'
let socket

import uuid from 'uuid-random'

import useAuth from '../hooks/useAuth'

const VideoCall = (props) => {
  const { userProfile } = useAuth()
  const navigation = useNavigation()
  const videoCallUser = props?.route?.params?.videoCallUser
  const isFocused = useIsFocused()

  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [cameraRef, setCameraRef] = useState(null)
  const [cameraFlash, setCameraFlash] = useState(Camera?.Constants?.FlashMode?.off)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [sound, setSound] = useState()
  const [connectionState, setConnectionState] = useState('Connecting...')
  const [activeUsers, setActiveUsers] = useState()

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/vidCallDailing.wav')
    )
    setSound(sound)

    sound.setVolumeAsync(0.3)
    sound.setIsLoopingAsync(true)
    await sound.playAsync()
  }

  useEffect(() => {
    playSound()
  }, [])

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync()
      }
      : undefined
  }, [sound])

  useLayoutEffect(() => {
    const apiURL = 'http://192.168.43.97:3000'
    socket = io(`${apiURL}`)

    socket.on('all-users', users => {
      console.log('active users')
      users = users.filter(user => (user?.username != userProfile?.username))
      setActiveUsers(users)
    })
  }, [videoCallUser])

  useEffect(() => {
    socket.emit('startCall', {
      roomId: uuid(),
      user: userProfile,
      calling: videoCallUser
    })
  }, [videoCallUser])

  const hangup = () => {
    sound.stopAsync()
    navigation.goBack()
    socket.emit('startCall', {
      roomId: uuid(),
      user: userProfile,
      calling: videoCallUser
    }, e => e.emit('disconnect'))
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar color={'light'} />
      <ImageBackground
        source={{ uri: videoCallUser?.photoURL }}
        resizeMode='cover'
        style={{
          flex: 1,
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <LinearGradient
          colors={[color.labelColor, 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            width,
            height: height / 5,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: color.white,
              fontFamily: 'text',
              fontSize: 30
            }}
          >
            {connectionState}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={['transparent', color.labelColor]}
          style={{
            position: 'absolute',
            bottom: 0,
            width,
            height: height / 2,
            zIndex: 1
          }}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 170,
              right: 0,
              margin: 30,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 50
            }}
          >
            <TouchableOpacity
              onPress={
                () => setType(
                  type === Camera?.Constants?.Type?.back ?
                    Camera?.Constants?.Type?.front : Camera?.Constants?.Type?.back
                )
              }
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}
            >
              <MaterialIcons name='flip-camera-android' size={24} color={color.white} />
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
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              margin: 30,
              width: '60%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              onPress={hangup}
              style={{
                width: 70,
                height: 70,
                borderWidth: 6,
                backgroundColor: color.red,
                borderColor: color.faintRed,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <MaterialCommunityIcons name='phone-hangup' size={24} color={color.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <MaterialIcons name='pause' size={24} color={color.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FontAwesome5 name='volume-mute' size={24} color={color.white} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              overflow: 'hidden',
              height: 150,
              margin: 30,
              borderWidth: 4,
              borderRadius: 12,
              borderColor: color.white
            }}
          >
            {
              isFocused ?
                <Camera
                  ref={ref => setCameraRef(ref)}
                  ratio={'16:9'}
                  type={type}
                  flashMode={cameraFlash}
                  onCameraReady={() => setIsCameraReady(true)}
                  style={{
                    flex: 1,
                    backgroundColor: color.black,
                    aspectRatio: 9 / 16
                  }}
                /> : null
            }
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default VideoCall