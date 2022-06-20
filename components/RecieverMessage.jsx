import React, { useState, useEffect } from 'react'
import { View, Text, Image, Pressable, TouchableOpacity, UIManager, LayoutAnimation, Platform } from 'react-native'
import color from '../style/color'

import { AntDesign } from '@expo/vector-icons'

import Slider from '@react-native-community/slider'

import { Audio, Video } from 'expo-av'
import useAuth from '../hooks/useAuth'
import AutoHeightImage from 'react-native-auto-height-image'
import { useNavigation } from '@react-navigation/native'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const RecieverMessage = ({ messages, matchDetails, chatThemeIndex }) => {
  const { userProfile, user } = useAuth()

  const navigation = useNavigation()

  const [sound, setSound] = useState()
  const [status, setStatus] = useState()
  const [Value, SetValue] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [numberOfLines, setNumberOfLines] = useState(10)

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
          marginLeft: 10,
          maxWidth: '80%'
        }}
      >
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setShowTime(!showTime)
            setNumberOfLines(numberOfLines == 10 ? 1000 : 10)
          }}
          onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
        >
          {
            messages?.message &&
            <View>
              {
                messages?.reply ?
                  <View
                    style={{
                      backgroundColor: messages.message ? (userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.black : color.dark) : color.transparent,
                      padding: messages?.reply ? 5 : 10,
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                      borderBottomLeftRadius: 12
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => console.log('reply: ', messages?.reply)}
                      activeOpacity={0.7}
                      style={{
                        padding: 5,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        borderBottomLeftRadius: 8,
                        backgroundColor: messages.message ? (userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.lightText : color.black) : color.transparent,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        overflow: 'hidden'
                      }}
                    >
                      {
                        messages?.reply?.mediaType == 'video' &&
                        <Video
                          source={{ uri: messages?.reply?.media }}
                          resizeMode='cover'
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 8
                          }}
                        />
                      }
                      {
                        messages?.reply?.mediaType == 'image' &&
                        <Image
                          source={{ uri: messages?.reply?.media }}
                          resizeMode='cover'
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 8
                          }}
                        />
                      }
                      {
                        messages?.reply?.caption != '' &&
                        <Text
                          numberOfLines={3}
                          style={{
                            color: color.white,
                            marginLeft: messages?.reply?.media ? 10 : 0
                          }}
                        >
                          {messages?.reply?.caption}
                        </Text>
                      }
                      {
                        messages?.reply?.message &&
                        <Text
                          numberOfLines={3}
                          style={{
                            color: color.white,
                            marginLeft: messages?.reply?.media ? 10 : 0
                          }}
                        >
                          {messages?.reply?.message}
                        </Text>
                      }
                    </TouchableOpacity>
                    <Text
                      numberOfLines={numberOfLines}
                      style={{
                        color: color.white,
                        fontSize: 16,
                        textAlign: 'left'
                      }}
                    >
                      {messages?.message}
                    </Text>
                  </View> :
                  <View
                    style={{
                      backgroundColor: messages.message ? (userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.black : color.dark) : color.transparent,
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      borderTopRightRadius: 12
                    }}
                  >
                    <Text
                      numberOfLines={numberOfLines}
                      style={{
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
                        fontSize: 16,
                        textAlign: 'left'
                      }}
                    >
                      {messages?.message}
                    </Text>
                  </View>
              }
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <Text style={{ color: userProfile?.appMode == 'light' ? color.dark : color.white, fontSize: 8, textAlign: 'left' }}>
                      {new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                    </Text>
                  }
                </>
              }
            </View>
          }
          {
            messages?.mediaType == 'image' &&
            <View
              style={{
                position: 'relative'
              }}
            >
              <Pressable
                onPress={() => messages?.mediaType == 'image' ? navigation.navigate('ViewAvarar', { avatar: messages?.media }) : null}
                style={{ flex: 1 }}
                onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
              >
                <AutoHeightImage
                  source={{ uri: messages?.media }}
                  width={300}
                  resizeMode='cover'
                  style={{
                    flex: 1,
                    borderRadius: 20
                  }}
                />
              </Pressable>
              {
                messages?.caption &&
                <>
                  <View
                    style={{
                      width: '100%',
                      height: 30,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Text
                      numberOfLines={numberOfLines}
                      style={{
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
                        fontSize: 16,
                        textAlign: 'left'
                      }}
                    >
                      {messages?.caption}
                    </Text>
                  </View>
                  {
                    messages?.timestamp &&
                    <>
                      {
                        showTime &&
                        <Text style={{ color: userProfile?.appMode == 'light' ? color.dark : color.white, fontSize: 8, textAlign: 'left' }}>
                          {new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        </Text>
                      }
                    </>
                  }
                </>
              }
            </View>
          }

          {
            messages?.mediaType == 'video' &&
            <View
              style={{
                position: 'relative'
              }}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={() => messages?.mediaType == 'video' ? navigation.navigate('ViewVideo', { video: messages?.media }) : null}
                onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
              >
                <Video
                  source={{ uri: messages?.media }}
                  resizeMode='cover'
                  style={{
                    flex: 1,
                    minWidth: 300,
                    minHeight: 300,
                    borderRadius: 20
                  }}
                />
              </Pressable>
              {
                messages?.caption != '' &&
                <>
                  <View
                    style={{
                      width: '100%',
                      height: 30,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Text
                      numberOfLines={numberOfLines}
                      style={{
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
                        fontSize: 16,
                        textAlign: 'left'
                      }}
                    >
                      {messages?.caption}
                    </Text>
                  </View>
                  {
                    messages?.timestamp &&
                    <>
                      {
                        showTime &&
                        <Text style={{ color: userProfile?.appMode == 'light' ? color.dark : color.white, fontSize: 8, textAlign: 'left' }}>
                          {new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        </Text>
                      }
                    </>
                  }
                </>
              }
            </View>
          }

          {
            messages.voiceNote &&
            <View
              style={{
                position: 'relative',
                width: 200,
                height: 35,
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
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
                    <AntDesign name='caretright' size={20} color={color.white} /> :
                    <AntDesign name='pause' size={20} color={color.white} />
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