import React, { useState, useEffect } from 'react'
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native'
import color from '../style/color'

import { AntDesign } from '@expo/vector-icons'

import Slider from '@react-native-community/slider'

import { Audio } from 'expo-av'
import useAuth from '../hooks/useAuth'

const RecieverMessage = ({ messages, matchDetails }) => {
  const { userProfile, user } = useAuth()

  const [sound, setSound] = useState()
  const [status, setStatus] = useState()
  const [Value, SetValue] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const playVoicenote = async voiceNote => {
    const { sound, status } = await Audio?.Sound?.createAsync({ uri: voiceNote })
    setSound(sound)
    setStatus(status)
    setIsPlaying(true)
    sound?.setOnPlaybackStatusUpdate(UpdateStatus)
    await sound?.playAsync()
  }

  const pauseVoicenote = async voiceNote => {
    sound?.pauseAsync()
    setIsPlaying(false)
  }

  const UpdateStatus = async (data) => {
    try {
      if (data.didJustFinish) {
        SetValue(0)
        setIsPlaying(false)
      } else if (data.positionMillis) {
        if (data.durationMillis) {
          SetValue((data.positionMillis / data.durationMillis) * 100)
        }
      }
    } catch (error) {
      console.log('Error')
    }
  }

  useEffect(() => {
    return sound ? () => sound?.unloadAsync() : undefined
  }, [sound])

  return (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      <Image
        style={{ width: 30, height: 30, borderRadius: 50 }}
        source={{ uri: messages?.photoURL }}
      />
      <View
        style={{
          alignSelf: 'flex-end',
          marginLeft: 1,
          maxWidth: '80%'
        }}
      >
        <Pressable
          style={{
            backgroundColor: userProfile?.appMode != 'light' ? color.offWhite : color.lightText,
            paddingVertical: 6,
            paddingHorizontal: 15,
            alignSelf: 'flex-end',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            borderBottomLeftRadius: 12,
            marginLeft: 10
          }}
        >
          {
            messages?.message &&
            <Text
                style={{
                  color: userProfile?.appMode != 'light' ? color.dark : color.white,
                  fontSize: 18,
                  textAlign: 'left'
                }}
            >
              {messages?.message}
            </Text>
          }
          {
            messages?.image &&
            <View
              style={{
                position: 'relative',
                width: 300,
                height: 300,
                borderWidth: 2,
                borderRadius: 20,
                overflow: 'hidden',
                borderColor: color.red,
                left: 16
              }}
            >
              <Image style={{
                flex: 1,
                width: '100%',
                height: '100%'
              }}
                source={{ uri: messages?.image }}
              />
              {
                messages?.caption &&
                <View
                  style={{
                    width: '100%',
                    height: 30,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: color.white,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingHorizontal: 10
                  }}
                >
                  <Text>{messages?.caption}</Text>
                </View>
              }
            </View>
          }

          {
            messages.voiceNote &&
            <View
              style={{
                position: "relative",
                width: 200,
                height: 35,
                borderRadius: 20,
                overflow: "hidden",
                backgroundColor: userProfile?.appMode != 'light' ? color.offWhite : color.lightText,
                left: -10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 2,
                paddingRight: 10
              }}
            >
              <TouchableOpacity
                onPress={() => !isPlaying ? playVoicenote(messages.voiceNote) : pauseVoicenote(messages.voiceNote)}
                style={{
                  backgroundColor: color.blue,
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {
                  !isPlaying ?
                    <AntDesign name="caretright" size={20} color={color.white} /> :
                    <AntDesign name="pause" size={20} color={color.white} />
                }
              </TouchableOpacity>
              <Slider
                style={{ width: 150 }}
                value={Value}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor={color.blue}
                maximumTrackTintColor={color.blue}
                thumbTintColor={color.blue}
              />
            </View>
          }
        </Pressable>
      </View>
    </View>
  )
}

export default RecieverMessage