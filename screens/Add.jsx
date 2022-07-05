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
  ActivityIndicator,
  Platform
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
) UIManager.setLayoutAnimationEnabledExperimental(true)

import { useNavigation } from '@react-navigation/native'

import { Video } from 'expo-av'

import Bar from '../components/StatusBar'

import * as VideoThumbnails from 'expo-video-thumbnails'

import uuid from 'uuid-random'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import ViewShot from "react-native-view-shot"

const { width } = Dimensions.get('window')

const Add = () => {
  const { user, madiaString, userProfile } = useAuth()
  const navigation = useNavigation()
  const video = useRef(null)
  const viewShotRef = useRef(null)

  const [input, setInput] = useState('')
  const [height, setHeight] = useState(50)
  const [expanded, setExpanded] = useState(false)
  const [buttonsExpanded, setButtonsExpanded] = useState(false)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [status, setStatus] = useState({})
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [mediaType, setMediaType] = useState()
  const [mediaSize, setMediaSize] = useState()
  const [background, setBackground] = useState(null)
  const [backgroundTextColor, setBackgroundTextColor] = useState(null)
  const [postType, setPostType] = useState(null)

  const storage = getStorage()

  useEffect(() => {
    viewShotRef?.current?.capture()
      .then(uri => {
        setMedia(uri)
      })
  }, [background, backgroundTextColor, input])

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

  const saveVideoPost = async () => {
    const blob = await new Promise((resolve, reject) => {
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

    setLoading(true)
    uploadBytes(mediaRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref)
          .then(downloadURL => {
            navigation.goBack()
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
  }

  const savePost = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', media, true)
      xhr.send(null)
    })

    const mediaRef = ref(storage, `posts/${user?.uid}/media/${uuid()}`)

    setLoading(true)
    uploadBytes(mediaRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref)
          .then(downloadURL => {
            navigation.goBack()
            addDoc(collection(db, 'posts'), {
              user: {
                id: userProfile?.id,
                displayName: userProfile?.displayName,
                username: userProfile?.username,
                photoURL: userProfile?.photoURL
              },
              likesCount: 0,
              commentsCount: 0,
              mediaType: mediaType ? mediaType : null,
              mediaSize: mediaSize ? mediaSize : null,
              postType: postType || 'image',
              media: downloadURL,
              mediaLink: snapshot.ref._location.path,
              caption: input,
              timestamp: serverTimestamp()
            }).finally(() => setLoading(false))
          })
      })

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
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
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
            {
              !background &&
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
            }

            {
              background &&
              <View
                style={{
                  marginBottom: 10
                }}
              >
                {
                  background?.type == 'image' ?
                    <View>
                      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
                        <View
                          style={{
                            position: 'relative'
                          }}
                        >
                          <AutoHeightImage
                            source={{ uri: background?.background }}
                            width={width}
                            resizeMode='cover'
                            style={{
                              flex: 1
                            }}
                          />
                          <TextInput
                            multiline
                            value={input}
                            onChangeText={setInput}
                            placeholder="What's on your mind..."
                            placeholderTextColor={backgroundTextColor || color.black}
                            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                            style={{
                              flex: 1,
                              height,
                              position: 'absolute',
                              alignSelf: 'center',
                              bottom: '50%',
                              maxHeight: 300,
                              fontSize: 18,
                              paddingVertical: 10,
                              borderRadius: 12,
                              paddingHorizontal: 10,
                              color: backgroundTextColor || color.black,
                              fontFamily: 'boldText',
                              textAlign: 'center'
                            }}
                          />
                        </View>
                      </ViewShot>
                    </View> :
                    <View>
                      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
                        <View
                          style={{
                            width,
                            height: 300,
                            backgroundColor: background?.background
                          }}
                        >
                          <TextInput
                            multiline
                            value={input}
                            onChangeText={setInput}
                            placeholder="What's on your mind..."
                            placeholderTextColor={backgroundTextColor || color.black}
                            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                            style={{
                              flex: 1,
                              height,
                              position: 'absolute',
                              alignSelf: 'center',
                              bottom: '50%',
                              maxHeight: 300,
                              fontSize: 18,
                              paddingVertical: 10,
                              borderRadius: 12,
                              paddingHorizontal: 10,
                              color: backgroundTextColor || color.black,
                              fontFamily: 'boldText',
                              textAlign: 'center'
                            }}
                          />
                        </View>
                      </ViewShot>
                    </View>
                }
              </View>
            }

            {buttonsExpanded && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginLeft: 10
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'image',
                        background: 'https://firebasestorage.googleapis.com/v0/b/oymo-73694.appspot.com/o/post%20backgrounds%2F1.jpg?alt=media&token=0c8d109b-184c-446b-b60f-0a410e202acb'
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/oymo-73694.appspot.com/o/post%20backgrounds%2F1.jpg?alt=media&token=0c8d109b-184c-446b-b60f-0a410e202acb' }}
                      style={{
                        flex: 1
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'image',
                        background: 'https://firebasestorage.googleapis.com/v0/b/oymo-73694.appspot.com/o/post%20backgrounds%2F2.jpg?alt=media&token=315f2e5f-6e62-484d-a610-5fc0478e9707'
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      overflow: 'hidden',
                      marginLeft: 10
                    }}
                  >
                    <Image
                      source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/oymo-73694.appspot.com/o/post%20backgrounds%2F2.jpg?alt=media&token=315f2e5f-6e62-484d-a610-5fc0478e9707' }}
                      style={{
                        flex: 1
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'image',
                        background: 'https://firebasestorage.googleapis.com/v0/b/oymo-73694.appspot.com/o/post%20backgrounds%2F3.jpg?alt=media&token=315f2e5f-6e62-484d-a610-5fc0478e9707'
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      overflow: 'hidden',
                      marginLeft: 10
                    }}
                  >
                    <Image
                      source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/oymo-73694.appspot.com/o/post%20backgrounds%2F3.jpg?alt=media&token=315f2e5f-6e62-484d-a610-5fc0478e9707' }}
                      style={{
                        flex: 1
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'background',
                        background: color.dark
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.dark,
                      marginLeft: 10
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'background',
                        background: color.red
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.red,
                      marginLeft: 10
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'background',
                        background: color.purple
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.purple,
                      marginLeft: 10
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'background',
                        background: color.pink
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.pink,
                      marginLeft: 10
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setBackground({
                        type: 'background',
                        background: color.gold
                      })
                      setMediaType('image')
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.gold,
                      marginLeft: 10
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingHorizontal: 10
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setBackgroundTextColor(color.black)
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.black,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        color: color.white
                      }}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackgroundTextColor(color.red)
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.red,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        color: color.white
                      }}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackgroundTextColor(color.purple)
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.purple,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        color: color.white
                      }}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackgroundTextColor(color.pink)
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.pink,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        color: color.white
                      }}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackgroundTextColor(color.gold)
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.gold,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        color: color.white
                      }}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackgroundTextColor(color.green)
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.green,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        color: color.white
                      }}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setBackgroundTextColor(color.blue)
                      setPostType('poster')
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: color.blue,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        color: color.white
                      }}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                  setButtonsExpanded(!buttonsExpanded)
                }}
              >
                <Image
                  style={{
                    width: 45,
                    height: 45
                  }}
                  source={require('../assets/rb.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  flex: 1,
                  height: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                  borderRadius: 4,
                  marginRight: 5,
                  marginLeft: 5
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
          onPress={() => mediaType == 'video' ? saveVideoPost() : savePost()}
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