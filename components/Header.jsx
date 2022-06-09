import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign, FontAwesome5, Feather, SimpleLineIcons } from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'

let file
let link = `posts/${new Date().toISOString()}`

import * as Device from 'expo-device'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

const Header = ({
  showAratar,
  showLogo,
  showTitle,
  title,
  showBack,
  showMatchAvatar,
  matchAvatar,
  showPhone,
  showVideo,
  showPost,
  postDetails,
  showAdd,
  showCancelPost,
  showMessageImageGallerySelect,
  matchDetails,
  showNotification
}) => {
  const navigation = useNavigation()
  const { user, userProfile, madiaString, media, setMedia, notifications, setNotificatios } = useAuth()
  const storage = getStorage()
  const videoCallUser = getMatchedUserInfo(matchDetails?.users, user?.uid)

  const [loading, setLoading] = useState(false)
  const [mediaType, setMediaType] = useState('image')
  const [notificationCount, setNotificationCount] = useState([])

  useEffect(async () => {
    const querySnapshot = await getDocs(query(collection(db, 'users', user?.uid, 'notifications'), orderBy('timestamp', 'desc')))
    setNotificatios(
      querySnapshot.docs.map(doc => ({
        id: doc?.id,
        notification: doc?.id,
        ...doc?.data()
      }))
    )
  }, [userProfile, db])

  useEffect(async () => {
    const querySnapshot = await getDocs(query(collection(db, 'users', user?.uid, 'notifications'), where('seen', '==', false)))
    setNotificationCount(
      querySnapshot.docs.map(doc => ({
        id: doc?.id,
        notification: doc?.id,
        ...doc?.data()
      }))
    )
  }, [userProfile, db])

  const savePost = async () => {
    if (postDetails.caption || postDetails.media) {
      setLoading(true)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', postDetails.media, true)
        xhr.send(null)
      })

      const mediaRef = ref(storage, `posts/${new Date().toISOString()}`)

      uploadBytes(mediaRef, blob)
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
                media: downloadURL,
                mediaLink: snapshot.ref._location.path,
                mediaType,
                caption: postDetails.caption,
                timestamp: serverTimestamp()
              }).finally(() => {
                setLoading(false)
                cancelPost()
              })
            })
        })
    }
  }

  const cancelPost = async () => {
    postDetails = new Object()
    setMedia('')
    setLoading(false)
    navigation.goBack()
  }

  let extention = madiaString.slice(-7)

  useEffect(() => {
    if (extention.includes('jpg' || 'png' || 'gif' || 'jpeg' || 'JPEG' || 'JPG' || 'PNG' || 'GIF'))
      setMediaType('image')
    else if (extention.includes('mp4' || 'webm' || 'WEBM' || 'webM'))
      setMediaType('video')
  }, [media])

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        width: '100%'
      }}
    >
      <View
        style={{
          backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
          height: 50,
          marginTop: 40,
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {
            showBack &&
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              onLongPress={() => navigation.navigate('Feeds')}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <Entypo name='chevron-left' size={24} color={userProfile?.appMode == 'light' ? color.dark : color.white} />
            </TouchableOpacity>
          }
          {
            showLogo &&
            <Text
              style={{
                fontFamily: 'logo',
                fontSize: 30,
                margin: 0,
                marginTop: -10,
                color: userProfile?.appMode == 'light' ? color.black : color.white
              }}
            >
              Oymo
            </Text>
          }
          {
            showMatchAvatar &&
            <Image
              source={{ uri: matchAvatar }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                marginRight: 10
              }}
            />
          }
          {
            showTitle &&
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 18,
                textTransform: 'capitalize',
                color: userProfile?.appMode == 'light' ? color.dark : color.white
              }}
            >
              {title}
            </Text>
          }
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          {
            showPhone &&
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <Entypo name='phone' size={20} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
            </TouchableOpacity>
          }

          {
            showVideo &&
            <TouchableOpacity
              onPress={() => navigation.navigate('VideoCall', { videoCallUser })}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FontAwesome5 name='video' size={20} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
            </TouchableOpacity>
          }

          {
            showCancelPost &&
            <TouchableOpacity
              onPress={cancelPost}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
                borderWidth: 1,
                borderRadius: 4,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginRight: 5
              }}
            >
              <Text
                style={{
                  color: userProfile?.appMode == 'light' ? color.dark : color.white,
                  fontFamily: 'text'
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          }

          {
            showPost &&
            <TouchableOpacity
              onPress={savePost}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: loading == true ? color.faintRed : color.red,
                borderRadius: 4,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginLeft: 5
              }}
            >
              {
                loading ? <ActivityIndicator color={color.white} size='small' />
                  :
                  <>
                    <Feather name="corner-left-up" size={20} color={loading == true ? color.red : color.white} />
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
          }

          {
            showMessageImageGallerySelect &&
            <TouchableOpacity
              onPress={() => navigation.navigate('PreviewMessageImage')}
              style={{
                backgroundColor: color.red,
                borderRadius: 4,
                width: 80,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.white,
                  fontSize: 16
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          }

          {
            showNotification &&
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                marginRight: 10
              }}
            >
              <SimpleLineIcons name="bell" size={20} color={userProfile?.appMode == 'light' ? color.dark : color.white} />

              {
                notificationCount?.length > 0 &&
                <View
                  style={{
                    borderRadius: 50,
                    backgroundColor: color.red,
                    paddingHorizontal: 5,
                    position: 'absolute',
                    top: 0,
                    right: 0
                  }}
                >
                  <Text
                    style={{
                      color: color.white,
                      fontSize: 10
                    }}
                  >
                    {notificationCount?.length}
                  </Text>
                </View>
              }
            </TouchableOpacity>
          }

          {
            showAdd &&
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerWrapper: {
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 20
                  }
                }}
              >
                <FontAwesome name='plus-square-o' color={userProfile?.appMode == 'light' ? color.dark : color.white} size={26} />
              </MenuTrigger>

              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    width: 150,
                    borderRadius: 10,
                    overflow: 'hidden'
                  }
                }}
              >
                <MenuOption
                  onSelect={() => navigation.navigate('Add')}
                  customStyles={{
                    optionWrapper: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                      paddingVertical: 8
                    }
                  }}
                >
                  <Text>Post</Text>
                  <MaterialCommunityIcons name='grid' size={20} color={color.dark} />
                </MenuOption>

                <MenuOption
                  onSelect={() => navigation.navigate('AddReels')}
                  customStyles={{
                    optionWrapper: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                      paddingVertical: 8
                    }
                  }}
                >
                  <Text>Reel</Text>
                  <Image
                    source={require('../assets/video.png')}
                    style={{
                      width: 19,
                      height: 19
                    }}
                  />
                </MenuOption>
              </MenuOptions>
            </Menu>
          }

          {
            showAratar &&
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {
                user?.photoURL ?
                  <Image
                    source={{ uri: userProfile?.photoURL || user?.photoURL }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50
                    }}
                  />
                  :
                  <AntDesign name='user' size={24} color={color.lightText} />
              }
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}


export default Header