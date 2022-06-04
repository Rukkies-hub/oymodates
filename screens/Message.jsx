import React, { useState, useEffect } from 'react'

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
  SafeAreaView
} from 'react-native'

import color from '../style/color'

import Header from '../components/Header'

import { useRoute, useNavigation } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

import SenderMessage from '../components/SenderMessage'
import RecieverMessage from '../components/RecieverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useFonts } from 'expo-font'

import EmojiPicker, { emojiFromUtf16 } from '../components/emojiPicker'
import { emojis } from '../components/emojiPicker/data/emojis'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import * as ImagePicker from 'expo-image-picker'
import { Audio } from 'expo-av'

import uuid from 'uuid-random'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

const Message = () => {
  const navigation = useNavigation()
  const { user, userProfile } = useAuth()

  const { params } = useRoute()
  const { matchDetails } = params

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(50)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [activeInput, setActiveInput] = useState(false)
  const [recent, setRecent] = useState([])
  const [showRecording, setShowRecording] = useState(false)
  const [showSend, setShowSend] = useState(true)
  const [recording, setRecording] = useState()
  const [recordings, setRecordings] = useState([])
  const [recordingLoading, setRecordingLoading] = useState(false)

  useEffect(() =>
    onSnapshot(query(collection(db,
      'matches', matchDetails.id, 'messages'),
      orderBy('timestamp', 'desc')),
      snapshot => setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    )
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

  const sendMessage = () => {
    setExpanded(false)
    if (input != '')
      addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        username: userProfile.username,
        photoURL: matchDetails.users[user.uid].photoURL,
        message: input,
        seen: false
      })
    setInput('')
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

    const sourceRef = ref(storage, `messages/${user.uid}/audio/${uuid()}`)

    setRecordingLoading(true)

    uploadBytes(sourceRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref)
          .then(downloadURL => {
            addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
              userId: user.uid,
              username: userProfile.username,
              photoURL: matchDetails.users[user.uid].photoURL,
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'light' ? color.white : color.dark
      }}
    >
      <Header
        showBack
        showTitle
        showPhone
        showVideo
        showMatchAvatar
        matchDetails={matchDetails}
        title={getMatchedUserInfo(matchDetails?.users, user.uid).username}
        matchAvatar={getMatchedUserInfo(matchDetails?.users, user.uid).photoURL}
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
            message.userId === user.uid ? (
              <SenderMessage key={message.id} messages={message} matchDetails={matchDetails} />
            ) : (
              <RecieverMessage key={message.id} messages={message} matchDetails={matchDetails} />
            )
          )}
        />
      </TouchableWithoutFeedback>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
          borderTopWidth: .3,
          borderTopColor: color.borderColor,
          backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : color.lightText,
          minHeight: 50,
          overflow: 'hidden',
          position: 'relative',
          marginHorizontal: 10,
          borderRadius: 50
        }}
      >
        {
          mediaVidiblity && <>
            <TouchableOpacity
              style={{
                width: 40,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <MaterialCommunityIcons name='camera-outline' color={userProfile?.appMode == 'light' ? color.lightText : color.white} size={26} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('MessageImageGallery')}
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
                width: '100%',
                height: activeInput ? height : '100%',
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
      {expanded && (
        <View style={{ minWidth: 250, flex: 1 }}>
          <EmojiPicker
            colSize={9}
            emojis={emojis}
            recent={recent}
            autoFocus={false}
            loading={false}
            darkMode={false}
            onSelect={emoji => setInput(`${input} ${emoji.emoji}`)}
            onChangeRecent={setRecent}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default Message