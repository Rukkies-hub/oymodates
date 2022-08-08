import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'

import {
  View,
  Keyboard,
  TextInput,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Text,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  Dimensions
} from 'react-native'

import color from '../../style/color'

import { useRoute, useNavigation } from '@react-navigation/native'

import useAuth from '../../hooks/useAuth'

import getMatchedUserInfo from '../../lib/getMatchedUserInfo'

import SenderMessage from '../../components/SenderMessage'
import RecieverMessage from '../../components/recieverMessage/RecieverMessage'
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { MaterialCommunityIcons, AntDesign, SimpleLineIcons } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

import { Audio, Video } from 'expo-av'

import uuid from 'uuid-random'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

import * as ImagePicker from 'expo-image-picker'

import * as VideoThumbnails from 'expo-video-thumbnails'
import Slider from '@react-native-community/slider'
import MessageHeader from './components/MessageHeader'
import Avatar from './components/Avatar'
import { BlurView } from 'expo-blur'

const { width } = Dimensions.get('window')

const Message = () => {
  const navigation = useNavigation()
  const { user, userProfile, messageReply, setMessageReply, theme } = useAuth()

  const { matchDetails } = useRoute().params

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [height, setHeight] = useState(50)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [showRecording, setShowRecording] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [recording, setRecording] = useState()
  const [recordings, setRecordings] = useState([])
  const [recordingLoading, setRecordingLoading] = useState(false)
  const [showMedia, setShowMedia] = useState(false)
  const [showRecord, setShowRecord] = useState(true)

  useLayoutEffect(() =>
    (() => {
      onSnapshot(query(collection(db,
        'matches', matchDetails?.id, 'messages'),
        orderBy('timestamp', 'desc')),
        snapshot => setMessages(snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        })))
      )
    })()
    , [matchDetails, db])

  useEffect(() =>
    (() => {
      Keyboard.addListener('keyboardDidShow', () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setMediaVidiblity(false)
        setShowMedia(false)
      })
    })()
    , [])

  useEffect(() =>
    (() => {
      Keyboard.addListener('keyboardDidHide', () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setMediaVidiblity(true)
        setShowMedia(false)
      })
    })()
    , [])

  useEffect(() => {
    if (input.length >= 1) {
      setShowSend(true)
      setShowRecord(false)
    }
    else {
      setShowSend(false)
      setShowRecord(true)
    }
  }, [input])

  const updateSeen = async () => {
    const snapshot = await getDocs(query(collection(db, 'matches', matchDetails?.id, 'messages'),
      where('userId', '!=', userProfile?.id),
      where('seen', '==', false)
    ))
    snapshot.forEach(async allDoc => {
      await updateDoc(doc(db, 'matches', matchDetails?.id, 'messages', allDoc?.id), {
        seen: true
      })
    })
  }

  useLayoutEffect(() => {
    setInterval(() => {
      updateSeen()
    }, 1000)
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })

    if (!result?.cancelled) {
      if (result?.type === 'video') {
        const { uri } = await VideoThumbnails.getThumbnailAsync(result?.uri, { time: 1000 })
        if (uri) {
          setMediaVidiblity(false)
          setShowMedia(false)
          Keyboard.dismiss
          navigation.navigate('PreviewMessageImage', {
            matchDetails,
            media: {
              ...result,
              thumbnail: uri
            }
          })
        }
      } else {
        setMediaVidiblity(false)
        setShowMedia(false)
        Keyboard.dismiss
        navigation.navigate('PreviewMessageImage', {
          matchDetails,
          media: result
        })
      }
    }
  }

  const sendMessage = async () => {
    if (input != '') {
      addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: userProfile?.id,
        username: userProfile?.username,
        photoURL: matchDetails?.users[userProfile?.id]?.photoURL,
        message: input,
        reply: messageReply ? messageReply : null,
        seen: false
      })
      setInput('')
      setMessageReply(null)
      updateSeen()
      await updateDoc(doc(db, 'matches', matchDetails?.id), {
        timestamp: serverTimestamp()
      })
    }
  }

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()

      if (status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        )

        setRecording(recording)
      } else console.log('Please grant permission to app microphone')
    } catch (error) {
      console.log('Failed to start recording: ', error)
    }
  }

  const stopRecording = async () => {
    setRecording(undefined)
    await recording.stopAndUnloadAsync()

    let updateRecordings = [...recordings]
    const { sound, status } = await recording.createNewLoadedSoundAsync()
    updateRecordings = []
    updateRecordings.push({
      sound,
      duration: getDurationFormated(status?.durationMillis),
      file: recording.getURI()
    })

    setRecordings(updateRecordings)

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', recording.getURI(), true)
      xhr.send(null)
    })

    const sourceRef = ref(storage, `messages/${userProfile?.id}/audio/${uuid()}`)

    setRecordingLoading(true)

    uploadBytes(sourceRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot?.ref)
          .then(downloadURL => {
            addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
              userId: userProfile?.id,
              username: userProfile?.username,
              photoURL: matchDetails?.users[userProfile?.id]?.photoURL,
              voiceNote: downloadURL,
              mediaLink: snapshot?.ref?._location?.path,
              duration: getDurationFormated(status?.durationMillis),
              seen: false,
              timestamp: serverTimestamp(),
            }).finally(() => setRecordingLoading(false))
          })
      })
  }

  const getDurationFormated = millis => {
    const minutes = millis / 1000 / 60
    const minutesDisplay = Math.floor(minutes)
    const seconds = Math.round((minutes - minutesDisplay) * 60)
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds
    return `${minutesDisplay}:${secondsDisplay}`
  }
  // chatBG

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme == 'dark' ? color.black : color.white,
        borderRadius: 8,
        overflow: 'hidden'
      }}
    >
      <MessageHeader
        matchDetails={matchDetails}
        user={getMatchedUserInfo(matchDetails?.users, userProfile?.id)?.id}
      />

      <ImageBackground
        source={require('../../assets/chatBG.png')}
        style={{
          flex: 1,
          borderRadius: 8,
          overflow: 'hidden'
        }}
      >
        <BlurView
          intensity={120}
          tint={theme == 'dark' ? 'dark' : 'light'}
          style={{
            flex: 1,
            borderRadius: 8,
            overflow: 'hidden'
          }}
        >
          <KeyboardAvoidingView style={{ flex: 1 }}>
            {
              !messages?.length ?
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <View
                    style={{
                      position: 'relative'
                    }}
                  >
                    <Avatar user={getMatchedUserInfo(matchDetails?.users, userProfile?.id)?.id} />
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderWidth: 2,
                        borderColor: theme == 'dark' ? color.dark : color.offWhite,
                        borderRadius: 100,
                        overflow: 'hidden',
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        shadowColor: color.black,
                        shadowOffset: {
                          width: 0,
                          height: 4,
                        },
                        shadowOpacity: 0.30,
                        shadowRadius: 4.65,
                        elevation: 8
                      }}
                    >
                      <Image
                        source={{ uri: userProfile?.photoURL }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 100
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      marginTop: 20,
                      fontFamily: 'text',
                      fontSize: 16,
                      color: theme == 'dark' ? color.white : color.dark
                    }}
                  >
                    You matched with
                    <Text
                      style={{
                        fontFamily: 'boldText'
                      }}
                    >
                      {` ${getMatchedUserInfo(matchDetails?.users, userProfile?.id)?.username}`}
                    </Text>
                  </Text>
                </View> :
                <FlatList
                  inverted={-1}
                  style={{
                    flex: 1,
                    paddingHorizontal: 10
                  }}
                  data={messages}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item?.id}
                  renderItem={({ item: message }) => (
                    message?.userId === userProfile?.id ? (
                      <SenderMessage key={message?.id} messages={message} matchDetails={matchDetails} />
                    ) : (
                      <RecieverMessage key={message?.id} messages={message} matchDetails={matchDetails} />
                    )
                  )}
                />
            }

            <View>
              {
                messageReply &&
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                    marginTop: 10,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    overflow: 'hidden',
                    padding: 5
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      backgroundColor: theme == 'dark' ? color.black : color.white,
                      flex: 1,
                      borderRadius: 12,
                      overflow: 'hidden',
                      padding: 5
                    }}
                  >
                    {
                      messageReply?.mediaType == 'video' &&
                      <Image
                        source={{ uri: messageReply?.thumbnail }}
                        resizeMode='cover'
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 6
                        }}
                      />
                    }
                    {
                      messageReply?.mediaType == 'image' &&
                      <Image
                        source={{ uri: messageReply?.media }}
                        resizeMode='cover'
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 6
                        }}
                      />
                    }
                    {
                      messageReply?.voiceNote &&
                      <View
                        style={{
                          flex: 1,
                          position: 'relative',
                          height: 35,
                          borderRadius: 20,
                          overflow: 'hidden',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 2,
                          paddingLeft: 10
                        }}
                      >
                        <Slider
                          value={0}
                          minimumValue={0}
                          maximumValue={100}
                          style={{ flex: 1 }}
                          minimumTrackTintColor={theme == 'dark' ? color.white : color.blue}
                          maximumTrackTintColor={theme == 'dark' ? color.white : color.blue}
                          thumbTintColor={theme == 'dark' ? color.white : color.blue}
                        />
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{
                            backgroundColor: theme == 'dark' ? color.white : color.faintBlue,
                            width: 30,
                            height: 30,
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <AntDesign name='caretright' size={20} color={theme == 'dark' ? color.black : color.blue} />
                        </TouchableOpacity>
                      </View>
                    }
                    {
                      messageReply?.caption != '' &&
                      <Text
                        numberOfLines={3}
                        style={{
                          color: theme == 'light' ? color.dark : color.white,
                          marginLeft: messageReply?.media ? 10 : 0
                        }}
                      >
                        {messageReply?.caption}
                      </Text>
                    }
                    {
                      messageReply?.message &&
                      <Text
                        numberOfLines={3}
                        style={{
                          color: theme == 'light' ? color.dark : color.white,
                          marginLeft: messageReply?.media ? 10 : 0,
                          marginVertical: 10
                        }}
                      >
                        {messageReply?.message}
                      </Text>
                    }
                  </View>
                  {
                    messageReply &&
                    <TouchableOpacity
                      onPress={() => setMessageReply(null)}
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 12
                      }}
                    >
                      <AntDesign name='close' size={24} color={theme == 'light' ? color.dark : color.white} />
                    </TouchableOpacity>
                  }
                </TouchableOpacity>
              }
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                  minHeight: 50,
                  position: 'relative',
                  marginHorizontal: 10,
                  borderRadius: 12,
                  borderTopLeftRadius: messageReply ? 0 : 12,
                  borderTopRightRadius: messageReply ? 0 : 12,
                  marginBottom: 10,
                }}
              >
                {
                  mediaVidiblity &&
                  <View
                    style={{
                      position: 'relative',
                      width: 40,
                      height: 50,
                      backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                      borderBottomLeftRadius: 12,
                      borderTopLeftRadius: showMedia ? 0 : 12
                    }}
                  >
                    {
                      showMedia &&
                      <View
                        style={{
                          position: 'absolute',
                          zIndex: 100,
                          backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                          bottom: 50,
                          left: 0,
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setMediaVidiblity(false)
                            setShowMedia(false)
                            Keyboard.dismiss
                            navigation.navigate('MessageCamera', { matchDetails })
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <MaterialCommunityIcons name='camera-outline' color={theme == 'light' ? color.lightText : color.white} size={26} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={pickImage}
                          style={{
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <MaterialCommunityIcons name='image-outline' color={theme == 'light' ? color.lightText : color.white} size={26} />
                        </TouchableOpacity>
                      </View>
                    }

                    <TouchableOpacity
                      onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                        setShowMedia(!showMedia)
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <SimpleLineIcons name="paper-clip" size={20} color={theme == 'light' ? color.lightText : color.white} />
                    </TouchableOpacity>
                  </View>
                }

                {
                  showRecording ?
                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        maxHeight: 70,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'text',
                          color: theme == 'light' ? color.lightText : color.white
                        }}
                      >
                        Recording...
                      </Text>
                    </View> :
                    <TextInput
                      multiline
                      value={input}
                      onChangeText={setInput}
                      onSubmitEditing={sendMessage}
                      onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                      placeholder='Aa..'
                      placeholderTextColor={theme == 'light' ? color.lightText : color.white}
                      style={{
                        fontSize: 18,
                        flex: 1,
                        height,
                        maxHeight: 70,
                        fontFamily: 'text',
                        color: theme == 'light' ? color.dark : color.white,
                        paddingLeft: 10
                      }}
                    />
                }

                {
                  showSend &&
                  <TouchableOpacity
                    onPress={sendMessage}
                    style={{
                      width: 50,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <FontAwesome5
                      name='paper-plane'
                      color={theme == 'light' ? color.lightText : color.white}
                      size={20}
                    />
                  </TouchableOpacity>
                }

                {
                  showRecord &&
                  <TouchableOpacity
                    onLongPress={() => {
                      setShowRecording(true)
                      setShowSend(false)
                      startRecording()
                    }}
                    onPressOut={() => {
                      setShowRecording(false)
                      setShowSend(true)
                      stopRecording()
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    {
                      recordingLoading ?
                        <ActivityIndicator size='small' color={theme == 'light' ? color.lightText : color.white} /> :
                        <FontAwesome5
                          size={20}
                          name='microphone-alt'
                          color={theme == 'light' ? color.lightText : color.white}
                        />
                    }
                  </TouchableOpacity>
                }
              </View>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </ImageBackground>

    </View>
  )
}

export default Message
// in use