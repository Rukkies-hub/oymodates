import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import color from '../style/color'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'

import { Video } from 'expo-av'

import { LinearGradient } from 'expo-linear-gradient'
import LikeReels from '../components/LikeReels'

const { width, height } = Dimensions.get('window')

import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const ViewReel = (props) => {
  const navigation = useNavigation()
  const { userProfile, setReelsProps } = useAuth()
  const reel = props?.route?.params?.reel

  const ref = useRef(null)

  const [videoStatus, setVideoStatus] = useState({})

  useEffect(() =>
    navigation.addListener('blur', () => {
      ref.current.stopAsync()
      return () => unload()
    })
    , [navigation])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
      }}
    >
      <Header showBack showTitle title='View reel' showAratar />

      <View
        style={{
          position: 'relative',
          flex: 1,
          backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
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
          posterSource={{ uri: reel?.thumbnail }}
          posterStyle={{ resizeMode: 'cover', height: '100%' }}
          shouldPlay={false}
          source={{ uri: reel?.media }}
          onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
        />
      </View>

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
    </View>
  )
}

export default ViewReel