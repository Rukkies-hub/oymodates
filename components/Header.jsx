import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useNavigation } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'
import { addDoc, arrayUnion, collection } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

let file

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
  showAdd
}) => {
  const navigation = useNavigation()
  const { user, userProfile, madiaString, media } = useAuth()
  const storage = getStorage()

  const [loading, setLoading] = useState(false)
  const [mediaType, setMediaType] = useState('image')

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

      const uploadTask = uploadBytesResumable(mediaRef, blob)

      uploadTask.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        error => console.log('error uploading image: ', error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            file = downloadURL
            setLoading(true)
            addDoc(collection(db, 'posts'), {
              user: userProfile,
              media: arrayUnion(file),
              mediaType,
              caption: postDetails.caption
            }).finally(() => {
              setLoading(false)
              navigation.goBack()
            })
          })
        }
      )
    }
  }

  let extention = madiaString.slice(-7)

  useEffect(() => {
    if (extention.includes('jpg' || 'png' || 'gif' || 'jpeg' || 'JPEG' || 'JPG' || 'PNG' || 'GIF'))
      setMediaType('image')
    else if (extention.includes('mp4'))
      setMediaType('video')
  }, [media])

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        width: '100%'
      }}
    >
      <View
        style={{
          backgroundColor: color.white,
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
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <FontAwesome5 name='chevron-left' size={20} color={color.dark} />
            </TouchableOpacity>
          }
          {
            showLogo &&
            <Text
              style={{
                fontFamily: 'logo',
                fontSize: 30,
                margin: 0,
                marginTop: -10
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
                color: color.dark
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
              <FontAwesome5 name='phone' color={color.lightText} size={16} />
            </TouchableOpacity>
          }

          {
            showVideo &&
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FontAwesome5 name='video' color={color.lightText} size={16} />
            </TouchableOpacity>
          }

          {
            showPost &&
            <TouchableOpacity
              onPress={savePost}
              style={{
                backgroundColor: color.blue,
                borderRadius: 12,
                width: 60,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {
                loading ? <ActivityIndicator color={color.white} size='small' />
                  :
                  <Text
                    style={{
                      fontFamily: 'text',
                      color: color.white,
                      fontSize: 16
                    }}
                  >
                    Post
                  </Text>
              }
            </TouchableOpacity>
          }

          {
            showAdd &&
            <TouchableOpacity
              onPress={() => navigation.navigate('Add')}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20
              }}
            >
              <MaterialCommunityIcons name='plus-box-outline' color={color.dark} size={26} />
            </TouchableOpacity>
          }

          {
            showAratar &&
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
            >
              {
                user.photoURL ?
                  <Image
                    source={{ uri: userProfile?.photoURL || user.photoURL }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50
                    }}
                  />
                  :
                  <FontAwesome5 name='user' size={16} color={color.lightText} />
              }
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

export default Header