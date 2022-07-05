import React, { useState, useEffect, useRef } from 'react'

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
  UIManager,
  useWindowDimensions,
  Dimensions,
  ActivityIndicator
} from 'react-native'

import Header from '../components/Header'

import color from '../style/color'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { EvilIcons, Feather } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import * as ImagePicker from 'expo-image-picker'
import useAuth from '../hooks/useAuth'

import AutoHeightImage from 'react-native-auto-height-image'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import { useNavigation } from '@react-navigation/native'

import { Video } from 'expo-av'

import Bar from '../components/StatusBar'

import * as VideoThumbnails from 'expo-video-thumbnails'

import uuid from 'uuid-random'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'

const Add = () => {
  const { user, madiaString, userProfile } = useAuth()
  const navigation = useNavigation()
  const video = useRef(null)
  const windowWidth = useWindowDimensions().width

  const [input, setInput] = useState('')
  const [height, setHeight] = useState(50)
  const [expanded, setExpanded] = useState(false)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [status, setStatus] = useState({})
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [mediaType, setMediaType] = useState()
  const [mediaSize, setMediaSize] = useState()

  const storage = getStorage()

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.cancelled) {
      setMedia(result.uri)
      setMediaType(result.type)

      setMediaSize({ width: result.width, height: result.height })

      if (result.type == 'video') {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(result.uri, { time: 3000 })
          setThumbnail(uri)
        } catch (e) {
          console.warn(e)
        }
      }
    }
  }

  const savePost = async () => {
    setLoading(true)
    const mediaBlob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', media, true)
      xhr.send(null)
    })

    const thumbnailBlob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', thumbnail, true)
      xhr.send(null)
    })

    const mediaRef = ref(storage, `posts/${user?.uid}/media/${uuid()}`)

    const thumbnailRef = ref(storage, `posts/${user?.uid}/thumbnail/${uuid()}`)

    if (mediaType == 'video') {
      navigation.goBack()
      uploadBytes(mediaRef, mediaBlob)
        .then(snapshot => {
          getDownloadURL(snapshot.ref)
            .then(downloadURL => {
              uploadBytes(thumbnailRef, thumbnailBlob)
                .then(thumbnailSnapshot => {
                  getDownloadURL(thumbnailSnapshot.ref)
                    .then(thumbnailDownloadURL => {
                      addDoc(collection(db, 'posts'), {
                        user: {
                          id: userProfile?.id,
                          displayName: userProfile?.displayName,
                          username: userProfile?.username,
                          photoURL: userProfile?.photoURL
                        },
                        likesCount: 0,
                        commentsCount: 0,
                        mediaType,
                        mediaSize,
                        media: downloadURL,
                        mediaLink: snapshot.ref._location.path,
                        thumbnail: thumbnailDownloadURL,
                        thumbnailLink: thumbnailSnapshot.ref._location.path,
                        caption: input,
                        timestamp: serverTimestamp()
                      }).finally(() => setLoading(false))
                    })
                })
            })
        })
    } else {
      navigation.goBack()
      uploadBytes(mediaRef, mediaBlob)
        .then(snapshot => {
          getDownloadURL(snapshot.ref)
            .then(downloadURL => {
              setLoading(true)
              addDoc(collection(db, 'posts'), {
                user: {
                  id: userProfile?.id,
                  displayName: userProfile?.displayName,
                  username: userProfile?.username,
                  photoURL: userProfile?.photoURL
                },
                likesCount: 0,
                commentsCount: 0,
                mediaType,
                mediaSize,
                media: downloadURL,
                mediaLink: snapshot.ref._location.path,
                caption: input,
                timestamp: serverTimestamp()
              }).finally(() => setLoading(false))
            })
        })
    }
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setMediaVidiblity(false)
    })
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setExpanded(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setMediaVidiblity(true)
    })
  }, [])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black,
        position: 'relative'
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

      <Header
        showBack
        showTitle
        postDetails={{
          media,
          caption: input
        }}
        title='Create post'
      />

      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setMediaVidiblity(true)
          }}
        >
          <View>
            <View
              style={{
                maxHeight: 400,
                overflow: 'hidden',
                paddingHorizontal: 10,
                marginTop: 20,
                flexDirection: 'row'
              }}
            >
              <TextInput
                multiline
                value={input}
                onChangeText={setInput}
                placeholder="What's on your mind..."
                placeholderTextColor={userProfile?.theme == 'light' ? color.dark : color.white}
                onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                style={{
                  flex: 1,
                  height,
                  backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.lightText : color.dark,
                  maxHeight: 300,
                  fontSize: 18,
                  paddingVertical: 10,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  color: userProfile?.theme == 'light' ? color.dark : color.white
                }}
              />
              {
                media ?
                  <Image
                    style={{
                      aspectRatio: 9 / 16,
                      backgroundColor: color.black,
                      width: 60
                    }}
                    source={{ uri: media }}
                  /> :
                  thumbnail ?
                    <Image
                      style={{
                        aspectRatio: 9 / 16,
                        backgroundColor: color.black,
                        width: 60
                      }}
                      source={{ uri: thumbnail }}
                    /> : null
              }
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginTop: 10
              }}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  flex: 1,
                  height: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                  borderRadius: 4,
                  marginRight: 5
                }}
              >
                <EvilIcons name='image' size={24} color={userProfile?.theme == 'dark' ? color.white : color.dark} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('PostCamera')}
                style={{
                  flex: 1,
                  height: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                  borderRadius: 4,
                  marginLeft: 5
                }}
              >
                <EvilIcons name='camera' size={24} color={userProfile?.theme == 'dark' ? color.white : color.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          margin: 10
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flex: 1,
            height: 45,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginRight: 5
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.theme == 'light' ? color.dark : color.white
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={savePost}
          style={{
            flex: 1,
            height: 45,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.red,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 20
          }}
        >
          {
            loading ? <ActivityIndicator color={color.white} size='small' />
              :
              <>
                <Feather name='corner-left-up' size={20} color={loading == true ? color.red : color.white} />
                <Text
                  style={{
                    fontFamily: 'text',
                    marginLeft: 10,
                    color: loading == true ? color.red : color.white
                  }}
                >
                  Post
                </Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Add