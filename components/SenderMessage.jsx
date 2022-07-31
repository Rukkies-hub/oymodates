import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, Image, TouchableOpacity, UIManager, LayoutAnimation, Platform, ImageBackground } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'

import Slider from '@react-native-community/slider'

import { Audio, Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const SenderMessage = ({ messages, matchDetails }) => {
  const { userProfile, user, theme } = useAuth()

  const navigation = useNavigation()
  const video = useRef(null)

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
      if (data?.didJustFinish) {
        SetValue(0)
        setIsPlaying(false)
      } else if (data?.positionMillis) {
        if (data?.durationMillis) {
          SetValue((data?.positionMillis / data?.durationMillis) * 100)
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
    <View style={{ flexDirection: 'row-reverse', marginBottom: 10 }}>
      <Ionicons
        size={16}
        name={messages?.seen ? 'checkmark-done-circle' : 'checkmark-done-circle-outline'}
        color={!messages?.seen ? (theme == 'dark' ? color.offWhite : color.lightText) : color.blue}
      />
      <View
        style={{
          alignSelf: 'flex-end',
          maxWidth: '80%',
          marginRight: 5
        }}
      >
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setShowTime(!showTime)
            setNumberOfLines(numberOfLines == 10 ? 1000 : 10)
          }}
          delayLongPress={100}
          onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
        >
          {
            messages?.message &&
            <View>
              {
                messages?.reply ?
                  <View
                    style={{
                      backgroundColor: messages?.message ? color.blue : color.transparent,
                      padding: messages?.reply ? 5 : 10,
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => console.log('reply: ', messages?.reply)}
                      activeOpacity={0.7}
                      style={{
                        padding: 5,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        backgroundColor: color.darkBlue,
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
                        messages?.reply?.voiceNote &&
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Slider
                            value={0}
                            disabled={true}
                            minimumValue={0}
                            maximumValue={100}
                            style={{ flex: 1 }}
                            minimumTrackTintColor={theme == 'dark' ? color.white : color.blue}
                            maximumTrackTintColor={theme == 'dark' ? color.white : color.blue}
                            thumbTintColor={theme == 'dark' ? color.white : color.blue}
                          />
                        </View>
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
                      backgroundColor: messages?.message ? color.blue : color.transparent,
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 12,
                      borderBottomLeftRadius: 12,
                      borderTopLeftRadius: 12
                    }}
                  >
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
                  </View>
              }
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <Text style={{ color: theme == 'light' ? color.dark : color.white, fontSize: 8, textAlign: 'right', marginRight: 10, marginBottom: 10 }}>
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
                position: 'relative',
                borderRadius: 20,
                backgroundColor: color.blue,
                overflow: 'hidden'
              }}
            >
              <Pressable
                delayLongPress={100}
                style={{ maxHeight: 250 }}
                onPress={() => navigation.navigate('ViewAvatar', { avatar: messages?.media })}
                onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
              >
                <Image
                  source={{ uri: messages?.media }}
                  resizeMode='cover'
                  style={{
                    minWidth: 250,
                    minHeight: 250,
                    borderRadius: 20
                  }}
                />
              </Pressable>

              {
                messages?.caption &&
                <>
                  <View
                    style={{
                      flex: 1,
                      height: 30,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      padding: 5,
                      margin: 5,
                      backgroundColor: color.darkBlue,
                      borderRadius: 4,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20
                    }}
                  >
                    <Text
                      numberOfLines={numberOfLines}
                      style={{
                        color: color.white,
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
                        <Text
                          style={{
                            color: color.white,
                            fontSize: 8,
                            textAlign: 'right',
                            marginRight: 10,
                            marginBottom: 10,
                            marginTop: 10
                          }}
                        >
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
                position: 'relative',
                backgroundColor: color.blue,
                borderRadius: 20,
                overflow: 'hidden'
              }}
            >
              <Pressable
                style={{ flex: 1 }}
                delayLongPress={100}
                  onPress={() => navigation.navigate('ViewVideo', {
                    video: messages?.media,
                    thumbnail: messages?.thumbnail
                  })}
                onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
              >
                <Image
                  source={{ uri: messages?.thumbnail }}
                  resizeMode='cover'
                  style={{
                    minWidth: 250,
                    minHeight: 250,
                    borderRadius: 20
                  }}
                />
              </Pressable>
              {
                messages?.caption != '' &&
                <>
                  <View
                    style={{
                      flex: 1,
                      height: 30,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      padding: 5,
                      margin: 5,
                      backgroundColor: color.darkBlue,
                      borderRadius: 4,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20
                    }}
                  >
                    <Text
                      numberOfLines={numberOfLines}
                      style={{
                        color: color.white,
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
                        <Text
                          style={{
                            color: color.white,
                            fontSize: 8,
                            textAlign: 'right',
                            marginRight: 10,
                            marginBottom: 10
                          }}
                        >
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
            messages?.voiceNote &&
            <View
              style={{
                position: 'relative',
                width: 200,
                height: 35,
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: color.blue,
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
                onPress={() => !isPlaying ? playVoicenote(messages?.voiceNote) : pauseVoicenote(messages?.voiceNote)}
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
                    <AntDesign name='caretright' size={20} color={color.blue} /> :
                    <AntDesign name='pause' size={20} color={color.blue} />
                }
              </TouchableOpacity>
            </View>
          }
        </Pressable>
      </View >
    </View >
  )
}

export default SenderMessage
// in use