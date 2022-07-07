import React, { useEffect, useRef, useState } from 'react'

import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  Dimensions,
  Keyboard,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'

import Header from '../../components/Header'

import color from '../../style/color'

import useAuth from '../../hooks/useAuth'

const { width, height } = Dimensions.get('window')

import AutoHeightImage from 'react-native-auto-height-image'

import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { FlatGrid } from 'react-native-super-grid'
import smileys from '../../components/emoji/smileys'
import smileys1 from '../../components/emoji/smileys1'
import smileys2 from '../../components/emoji/smileys2'
import smileys3 from '../../components/emoji/smileys3'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

import { Audio, Video } from 'expo-av'

import uuid from 'uuid-random'

import Bar from '../../components/StatusBar'

const PreviewMessageImage = () => {
  const { userProfile, user } = useAuth()

  const { params } = useRoute()
  const { matchDetails, media } = params
  const navigation = useNavigation()
  const video = useRef(null)

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(50)
  const [sendLoading, setSendLoading] = useState(false)
  const [status, setStatus] = useState({})

  useEffect(() =>
    (() => {
      Keyboard.addListener('keyboardDidHide', () => {
        setExpanded(false)
        Keyboard.dismiss
      })
    })()
    , [])

  const sendMessage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', media?.uri, true)
      xhr.send(null)
    })

    setSendLoading(true)

    const sourceRef = ref(storage, `messages/${user?.uid}/${media?.type == 'image' ? 'image' : 'video'}/${uuid()}`)

    uploadBytes(sourceRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot?.ref)
          .then(downloadURL => {
            setExpanded(false)
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
              setInput('')
              navigation.goBack()
            })
          })
      })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black
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
            backgroundColor: userProfile?.theme == 'light' ? color.offWhite : userProfile?.theme == 'dark' ? color.lightText : color.dark,
            minHeight: 50,
            overflow: 'hidden',
            position: 'relative',
            marginHorizontal: 10,
            borderRadius: 12,
            marginBottom: 15
          }}
        >
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
            <MaterialCommunityIcons name='emoticon-happy-outline' color={userProfile?.theme == 'light' ? color.lightText : color.white} size={26} />
          </TouchableOpacity>

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
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default PreviewMessageImage