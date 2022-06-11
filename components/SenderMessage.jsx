import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { AntDesign } from '@expo/vector-icons'

import Slider from '@react-native-community/slider'

import { Audio } from 'expo-av'
import moment from 'moment'

const SenderMessage = ({ messages, matchDetails }) => {
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
    <View style={{ flexDirection: "row-reverse", marginBottom: 10 }}>
      <Image
        style={{ width: 30, height: 30, borderRadius: 50 }}
        source={{ uri: userProfile?.photoURL }}
      />
      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 10,
          maxWidth: "80%"
        }}
      >
        <Pressable>
          {
            messages?.message &&
            <>
              <View
                style={{
                  backgroundColor: messages.message ? color.blue : color.transparent,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
                <Text style={{ color: color.white, fontSize: 16, textAlign: "left" }}>
                  {messages?.message}
                </Text>
              </View>
              {
                messages?.timestamp &&
                <Text style={{ color: userProfile?.appMode == 'light' ? color.dark : color.white, fontSize: 10, textAlign: "right" }}>
                  {new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                </Text>
              }
            </>
          }
          {
            messages?.image &&
            <View
              style={{
                position: "relative",
                width: 300,
                height: 300,
                borderWidth: 2,
                borderRadius: 20,
                overflow: "hidden",
                borderColor: color.blue,
                right: 6
              }}
            >
              <Image style={{
                flex: 1,
                width: "100%",
                height: "100%"
              }}
                source={{ uri: messages?.image }}
              />
              {
                messages?.caption &&
                <View
                  style={{
                    width: "100%",
                    height: 30,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    backgroundColor: color.white,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
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
                backgroundColor: color.blue,
                right: -10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 2,
                paddingLeft: 10
              }}
            >
              <Slider
                style={{ width: 150 }}
                value={Value}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor={color.white}
                maximumTrackTintColor={color.offWhite}
                thumbTintColor={color.offWhite}
              />
              <TouchableOpacity
                onPress={() => !isPlaying ? playVoicenote(messages.voiceNote) : pauseVoicenote(messages.voiceNote)}
                style={{
                  backgroundColor: color.white,
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {
                  !isPlaying ?
                    <AntDesign name="caretright" size={20} color={color.blue} /> :
                    <AntDesign name="pause" size={20} color={color.blue} />
                }
              </TouchableOpacity>
            </View>
          }
        </Pressable>
      </View>
    </View>
  )
}

export default SenderMessage