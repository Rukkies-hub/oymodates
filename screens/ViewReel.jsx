import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native'
import color from '../style/color'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'

import { Video } from 'expo-av'

import { LinearGradient } from 'expo-linear-gradient'
import LikeReels from '../components/LikeReels'

const { width, height } = Dimensions.get('window')

import { AntDesign, FontAwesome, Entypo } from '@expo/vector-icons'
import { useIsFocused, useNavigation } from '@react-navigation/native'

import Bar from '../components/StatusBar'

const ViewReel = (props) => {
  const navigation = useNavigation()
  const focus = useIsFocused()
  const { userProfile, setReelsProps } = useAuth()
  const reel = props?.route?.params?.reel

  const ref = useRef(null)

  const [videoStatus, setVideoStatus] = useState({})

  useLayoutEffect(() => {
    ref.current.playAsync()
  }, [])

  useEffect(() =>
    navigation.addListener('blur', () => {
      ref.current.stopAsync()
      return () => unload()
    })
    , [navigation])

  return (
    <ImageBackground
      source={{ uri: reel?.thumbnail }}
      resizeMode='cover'
      blurRadius={50}
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Bar color={'light'} />

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

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => videoStatus.isPlaying ? ref.current.pauseAsync() : ref.current.playAsync()}
        style={{
          flex: 1,
          width,
          backgroundColor: color.transparent
        }}
      >
        {
          focus &&
          <Video
            ref={ref}
            style={{ flex: 1, backgroundColor: color.transparent }}
            resizeMode='contain'
            isLooping
            usePoster
            posterSource={{ uri: reel?.thumbnail }}
            posterStyle={{ resizeMode: 'contain', height: '100%' }}
            shouldPlay={false}
            source={{ uri: reel?.media }}
            onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
          />
        }
      </TouchableOpacity>

      <LinearGradient
        colors={['transparent', color.labelColor]}
        style={{
          position: 'absolute',
          bottom: 0,
          width,
          height: height / 3,
          zIndex: 1
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            marginBottom: 20,
            marginLeft: 10
          }}
        >
          <Text
            style={{
              color: color.white,
              fontFamily: 'text',
              fontSize: 16
            }}
          >
            {reel?.user?.displayName}
          </Text>
          <Text
            style={{
              color: color.white,
              fontSize: 16
            }}
          >
            {reel?.description}
          </Text>
        </View>

        <View
          style={{
            marginVertical: 30,
            position: 'absolute',
            right: 0,
            bottom: 0,
            margin: 20
          }}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderWidth: 4,
              borderRadius: 100,
              borderColor: color.white,
              overflow: 'hidden'
            }}
          >
            <Image
              source={{ uri: reel?.user?.photoURL }}
              style={{
                width: 50,
                height: 50
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              paddingVertical: 10,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
            }}
          >
            <LikeReels reel={reel} />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ReelsComment')
                setReelsProps(reel)
              }}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FontAwesome name="comment" size={24} color={color.white} />
              <Text
                style={{
                  color: color.white,
                  fontFamily: 'text',
                  marginTop: 5
                }}
              >
                {reel?.commentsCount ? reel?.commentsCount : '0'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default ViewReel