import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { AntDesign } from '@expo/vector-icons'

import Slider from 'react-native-slider'

import { Audio } from 'expo-av'

const SenderMessage = ({ messages, matchDetails }) => {
  // const context = useContext()
  const { userProfile, user } = useAuth()

  const [sound, setSound] = useState()

  const playVoicenote = async voiceNote => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: voiceNote })
    setSound(sound)

    console.log('Playing Sound')
    await sound.playAsync()
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound')
        sound.unloadAsync()
      }
      : undefined
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
        <Pressable
          style={{
            backgroundColor: messages.message ? color.blue : color.transparent,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          {
            messages?.message && <Text
              style={{ color: color.white, fontSize: 18, textAlign: "right" }}
            >
              {messages?.message}
            </Text>
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
                value={parseInt(messages.duration)}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={color.white}
                maximumTrackTintColor={color.offWhite}
                thumbTintColor={color.offWhite}
                onValueChange={value => {
                  console.log(value)
                }}
              />
              <TouchableOpacity
                onPress={() => playVoicenote(messages.voiceNote)}
                style={{
                  backgroundColor: color.white,
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <AntDesign name="caretright" size={20} color={color.blue} />
              </TouchableOpacity>
            </View>
          }
        </Pressable>
      </View>
    </View>
  )
}

export default SenderMessage