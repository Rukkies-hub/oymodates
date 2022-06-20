import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'

import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground
} from 'react-native'

import color from '../style/color'

import Header from '../components/Header'

import { useRoute, useNavigation } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

import SenderMessage from '../components/SenderMessage'
import RecieverMessage from '../components/RecieverMessage'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import smileys from '../components/emoji/smileys'
import smileys1 from '../components/emoji/smileys1'
import smileys2 from '../components/emoji/smileys2'
import smileys3 from '../components/emoji/smileys3'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

import { Audio, Video } from 'expo-av'

import uuid from 'uuid-random'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

import { FlatGrid } from 'react-native-super-grid'

import * as ImagePicker from 'expo-image-picker'

import Bar from '../components/StatusBar'

const Message = () => {
  const navigation = useNavigation()
  const { user, userProfile, messageReply, setMessageReply } = useAuth()

  const { params } = useRoute()
  const { matchDetails } = params

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(50)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [showRecording, setShowRecording] = useState(false)
  const [showSend, setShowSend] = useState(true)
  const [recording, setRecording] = useState()
  const [recordings, setRecordings] = useState([])
  const [recordingLoading, setRecordingLoading] = useState(false)
  const [chatTheme, setChatTheme] = useState()
  const [chatThemeIndex, setChatThemeIndex] = useState()

  useEffect(() =>
    onSnapshot(query(collection(db,
      'matches', matchDetails?.id, 'messages'),
      orderBy('timestamp', 'desc')),
      snapshot => setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    )
    , [matchDetails, db])

  useEffect(() =>
    onSnapshot(doc(db, 'matches', matchDetails?.id), doc => {
      setChatTheme(doc.data()?.chatTheme)
      setChatThemeIndex(doc.data()?.chatThemeIndex)
    })
    , [matchDetails, db])

  useEffect(() =>
    Keyboard.addListener('keyboardDidShow', () => {
      setExpanded(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setMediaVidiblity(false)
    })
    , [])

  useEffect(() =>
    Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setMediaVidiblity(true)
    })
    , [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.cancelled) navigation.navigate('PreviewMessageImage', { matchDetails, media: result })
  }

  const sendMessage = () => {
    setExpanded(false)
    if (input != '')
      addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: user?.uid,
        username: userProfile.username,
        photoURL: matchDetails.users[user?.uid].photoURL,
        message: input,
        reply: messageReply ? messageReply : null,
        seen: false
      })
    setInput('')
    setMessageReply(null)
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
      duration: getDurationFormated(status.durationMillis),
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

    const sourceRef = ref(storage, `messages/${user?.uid}/audio/${uuid()}`)

    setRecordingLoading(true)

    uploadBytes(sourceRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref)
          .then(downloadURL => {
            addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
              userId: user?.uid,
              username: userProfile.username,
              photoURL: matchDetails.users[user?.uid].photoURL,
              voiceNote: downloadURL,
              mediaLink: snapshot.ref._location.path,
              duration: getDurationFormated(status.durationMillis),
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

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => {
        setExpanded(false)
        Keyboard.dismiss
      }}>
        <ImageBackground
          source={{ uri: chatTheme ? chatTheme : null }}
          blurRadius={40}
          style={{
            flex: 1,
            backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
          }}
        >
          <Bar
            color={
              chatThemeIndex == 1 || 2 || 3 || 5 || 6 || 7 || 8 || 9 || 10 ? 'light' :
                chatThemeIndex == 4 ? 'dark' :
                  'dark'
            }
          />
          <Header
            showBack
            showTitle
            showPhone
            showVideo
            showMatchAvatar
            matchDetails={matchDetails}
            title={`@${getMatchedUserInfo(matchDetails?.users, user?.uid).username}`}
            matchAvatar={getMatchedUserInfo(matchDetails?.users, user?.uid).photoURL}
            showChatMenu
            backgroundColor={color.transparent}
            iconColor={
              chatThemeIndex == 1 || 2 || 3 || 5 || 6 || 7 || 8 || 9 || 10 ? color.white :
                chatThemeIndex == 4 ? color.dark :
                  color.red
            }
          />

          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
          >
            <FlatList
              inverted={-1}
              style={{
                flex: 1,
                paddingHorizontal: 10
              }}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item: message }) => (
                message.userId === user?.uid ? (
                  <SenderMessage key={message.id} messages={message} matchDetails={matchDetails} chatThemeIndex={chatThemeIndex} />
                ) : (
                  <RecieverMessage key={message.id} messages={message} matchDetails={matchDetails} chatThemeIndex={chatThemeIndex} />
                )
              )}
            />
          </TouchableWithoutFeedback>

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
                  backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
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
                    backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.lightText,
                    flex: 1,
                    borderRadius: 12,
                    overflow: 'hidden',
                    padding: 5
                  }}
                >
                  {
                    messageReply?.mediaType == 'video' &&
                    <Video
                      source={{ uri: messageReply?.media }}
                      resizeMode='cover'
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 12
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
                        borderRadius: 12
                      }}
                    />
                  }
                  {
                    messageReply?.caption != '' &&
                    <Text
                      numberOfLines={3}
                      style={{
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
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
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
                        marginLeft: messageReply?.media ? 10 : 0
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
                    <AntDesign name='close' size={24} color={userProfile?.appMode == 'light' ? color.dark : color.white} />
                  </TouchableOpacity>
                }
              </TouchableOpacity>
            }
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
                minHeight: 50,
                overflow: 'hidden',
                position: 'relative',
                marginHorizontal: 10,
                borderRadius: 12,
                borderTopLeftRadius: messageReply ? 0 : 12,
                borderTopRightRadius: messageReply ? 0 : 12,
                marginBottom: 15
              }}
            >
              {
                mediaVidiblity && <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('MessageCamera', { matchDetails })}
                    style={{
                      width: 40,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <MaterialCommunityIcons name='camera-outline' color={userProfile?.appMode == 'light' ? color.lightText : color.white} size={26} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      width: 40,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <MaterialCommunityIcons name='image-outline' color={userProfile?.appMode == 'light' ? color.lightText : color.white} size={26} />
                  </TouchableOpacity>
                </>
              }
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss()
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                  setExpanded(!expanded)
                }}
                style={{
                  width: 40,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <MaterialCommunityIcons name='emoticon-happy-outline' color={userProfile?.appMode == 'light' ? color.lightText : color.white} size={26} />
              </TouchableOpacity>

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
                        color: userProfile?.appMode == 'light' ? color.lightText : color.white
                      }}
                    >
                      Recording...
                    </Text>
                  </View>
                  :
                  <TextInput
                    multiline
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                    placeholder='Aa..'
                    placeholderTextColor={userProfile?.appMode == 'light' ? color.lightText : color.white}
                    style={{
                      fontSize: 18,
                      flex: 1,
                      height,
                      maxHeight: 70,
                      fontFamily: 'text',
                      color: userProfile?.appMode == 'light' ? color.dark : color.white
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
                    color={userProfile?.appMode == 'light' ? color.lightText : color.white}
                    size={20}
                  />
                </TouchableOpacity>
              }

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
                    <ActivityIndicator size='small' color={userProfile?.appMode == 'light' ? color.lightText : color.white} /> :
                    <FontAwesome5
                      size={20}
                      name="microphone-alt"
                      color={userProfile?.appMode == 'light' ? color.lightText : color.white}
                    />
                }
              </TouchableOpacity>
            </View>
          </View>

          {
            expanded && (
              <View style={{ minWidth: 150, maxHeight: 150, flex: 1 }}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  scrollEnabled

                >
                  <FlatGrid
                    data={smileys}
                    itemDimension={30}
                    renderItem={({ item: emoji }) => (
                      <TouchableOpacity onPress={() => setInput(input + emoji.emoji)}>
                        <Text style={{ fontSize: 30 }}>{emoji.emoji}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <FlatGrid
                    data={smileys1}
                    itemDimension={30}
                    renderItem={({ item: emoji }) => (
                      <TouchableOpacity onPress={() => setInput(input + emoji.emoji)}>
                        <Text style={{ fontSize: 30 }}>{emoji.emoji}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <FlatGrid
                    data={smileys2}
                    itemDimension={30}
                    renderItem={({ item: emoji }) => (
                      <TouchableOpacity onPress={() => setInput(input + emoji.emoji)}>
                        <Text style={{ fontSize: 30 }}>{emoji.emoji}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <FlatGrid
                    data={smileys3}
                    itemDimension={30}
                    renderItem={({ item: emoji }) => (
                      <TouchableOpacity onPress={() => setInput(input + emoji.emoji)}>
                        <Text style={{ fontSize: 30 }}>{emoji.emoji}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </ScrollView>
              </View>
            )
          }
        </ImageBackground >
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Message