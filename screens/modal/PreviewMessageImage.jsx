import React, { useEffect, useRef, useState } from 'react'

import {
  View,
  SafeAreaView,
  Pressable,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native'

import Header from '../../components/Header'

import color from '../../style/color'

import useAuth from '../../hooks/useAuth'

const { width } = Dimensions.get('window')

import AutoHeightImage from 'react-native-auto-height-image'

import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

import { Video } from 'expo-av'

import uuid from 'uuid-random'

import Bar from '../../components/StatusBar'

const PreviewMessageImage = () => {
  const { userProfile, user } = useAuth()

  const { matchDetails, media } = useRoute().params
  const navigation = useNavigation()
  const video = useRef(null)

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [height, setHeight] = useState(50)
  const [sendLoading, setSendLoading] = useState(false)
  const [status, setStatus] = useState({})
  const [disableButton, setDisableButton] = useState(false)

  useEffect(() =>
    (() => {
      Keyboard.addListener('keyboardDidHide', () => {
        Keyboard.dismiss
      })
    })()
    , [])

  const sendMessage = async () => {
    const videoBlob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', media?.uri, true)
      xhr.send(null)
    })

    const thumbnailBlob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', media?.thumbnail, true)
      xhr.send(null)
    })

    setDisableButton(true)
    setSendLoading(true)

    const mediaRef = ref(storage, `messages/${user?.uid}/${media?.type == 'image' ? 'image' : 'video'}/${uuid()}`)
    const thumbnailRef = ref(storage, `messages/${user?.uid}/${'thumbnail'}/${uuid()}`)

    if (media?.thumbnail)
      uploadBytes(mediaRef, videoBlob)
        .then(snapshot => {
          getDownloadURL(snapshot?.ref)
            .then(downloadURL => {
              uploadBytes(thumbnailRef, thumbnailBlob)
                .then(thumbnailSnapshot => {
                  getDownloadURL(thumbnailSnapshot?.ref)
                    .then(thumbnailDownloadURL => {
                      addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
                        userId: user?.uid,
                        username: userProfile?.username,
                        photoURL: matchDetails?.users[user?.uid].photoURL,
                        mediaLink: snapshot?.ref?._location?.path,
                        mediaType: media?.type,
                        media: downloadURL,
                        thumbnail: thumbnailDownloadURL,
                        caption: input,
                        seen: false,
                        timestamp: serverTimestamp(),
                      }).finally(() => {
                        setSendLoading(false)
                        setDisableButton(false)
                        setInput('')
                        navigation.navigate('Message', { matchDetails })
                      })
                    })
                })
            })
        })

    else
      uploadBytes(mediaRef, videoBlob)
        .then(snapshot => {
          getDownloadURL(snapshot?.ref)
            .then(downloadURL => {
              addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
                userId: user?.uid,
                username: userProfile?.username,
                photoURL: matchDetails?.users[user?.uid].photoURL,
                mediaLink: snapshot?.ref?._location?.path,
                mediaType: media?.type,
                media: downloadURL,
                caption: input,
                seen: false,
                timestamp: serverTimestamp(),
              }).finally(() => {
                setSendLoading(false)
                setDisableButton(false)
                setInput('')
                navigation.navigate('Message', { matchDetails })
              })
            })
        })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
        }}
      >
        <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

        <Header showBack showTitle title='Preview image' />

        {
          media?.type == 'image' &&
          <AutoHeightImage
            source={{ uri: media?.uri }}
            width={width}
            style={{ flex: 1 }}
            resizeMode='contain'
          />
        }

        {
          media?.type == 'video' &&
          <Pressable
            onPress={() => status?.isPlaying ? video?.current?.pauseAsync() : video?.current?.playAsync()}
            style={{ flex: 1 }}
          >
            <Video
              ref={video}
              source={{ uri: media?.uri }}
              width={width}
              style={{ flex: 1 }}
              resizeMode={Video.RESIZE_MODE_CONTAIN}
              isLooping={true}
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </Pressable>
        }

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
            minHeight: 50,
            overflow: 'hidden',
            position: 'relative',
            marginHorizontal: 10,
            borderRadius: 12
          }}
        >
          <TextInput
            multiline
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            placeholder='Aa..'
            placeholderTextColor={userProfile?.theme == 'light' ? color.lightText : color.white}
            style={{
              fontSize: 18,
              flex: 1,
              height,
              maxHeight: 70,
              fontFamily: 'text',
              color: userProfile?.theme == 'light' ? color.dark : color.white
            }}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={disableButton}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {
              sendLoading ?
                <ActivityIndicator color={userProfile?.theme == 'light' ? color.lightText : color.white} size='small' /> :
                <FontAwesome5
                  name='paper-plane'
                  color={userProfile?.theme == 'light' ? color.lightText : color.white}
                  size={20}
                />
            }
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default PreviewMessageImage