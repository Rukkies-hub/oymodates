import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native'
import color from '../style/color'
import Header from '../components/Header'
import { useNavigation, useRoute } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'

import { useFonts } from 'expo-font'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'

import uuid from 'uuid-random'
import Bar from '../components/StatusBar'

import * as Notifications from 'expo-notifications'

import * as Device from 'expo-device'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
})

const SaveReels = () => {
  const { userProfile, user, theme } = useAuth()
  const navigation = useNavigation()
  const { source, thumbnail, mediaType } = useRoute().params


  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  const storage = getStorage()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const saveReel = async () => {
    if (mediaType === 'video') {
      setLoading(true)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', source, true)
        xhr.send(null)
      })

      const thumbnailBlob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', thumbnail, true)
        xhr.send(null)
      })

      const sourceRef = ref(storage, `reels/${userProfile?.id}/video/${uuid()}`)

      const thumbnailRef = ref(storage, `reels/${userProfile?.id}/thumbnail/${uuid()}`)

      uploadBytes(sourceRef, blob)
        .then(snapshot => {
          getDownloadURL(snapshot.ref)
            .then(downloadURL => {
              uploadBytes(thumbnailRef, thumbnailBlob)
                .then(thumbnailSnapshot => {
                  getDownloadURL(thumbnailSnapshot.ref)
                    .then(thumbnailDownloadURL => {
                      navigation.navigate('Reels')
                      addDoc(collection(db, 'reels'), {
                        user: { id: userProfile?.id },
                        media: downloadURL,
                        mediaLink: snapshot?.ref?._location?.path,
                        thumbnail: thumbnailDownloadURL,
                        thumbnailLink: thumbnailSnapshot?.ref?._location?.path,
                        description,
                        likesCount: 0,
                        commentsCount: 0,
                        timestamp: serverTimestamp()
                      }).finally(() => {
                        setLoading(false)
                        setDescription('')
                        schedulePushNotification()
                      })
                    })
                })
            })
        })
    }
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.transparent
      }}
    >
      <Bar color={theme == 'dark' ? 'light' : 'dark'} />

      <Header showBack showTitle title='Save reel' />

      <View
        style={{
          marginHorizontal: 10,
          flexDirection: 'row'
        }}
      >
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={150}
          placeholder="What's on your mind..."
          placeholderTextColor={theme == 'light' ? color.dark : color.white}
          style={{
            paddingVertical: 10,
            marginRight: 20,
            fontSize: 18,
            flex: 1,
            color: theme == 'light' ? color.dark : color.white
          }}
        />
        <Image
          source={{ uri: source }}
          style={{
            aspectRatio: 9 / 16,
            backgroundColor: color.black,
            width: 60
          }}
        />
      </View>

      <View style={{ flex: 1 }} />

      <View
        style={{
          flexDirection: 'row',
          margin: 10
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderColor: theme == 'light' ? color.borderColor : color.lightBorderColor,
            borderWidth: 1,
            borderRadius: 8,
            height: 45,
            marginRight: 5
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: theme == 'light' ? color.dark : color.white
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          onPress={saveReel}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: color.red,
            borderRadius: 8,
            height: 45,
            marginLeft: 5
          }}
        >

          {
            !loading ?
              <>
                <Feather name='corner-left-up' size={24} color={loading == true ? color.red : color.white} />
                <Text
                  style={{
                    fontFamily: 'text',
                    marginLeft: 10,
                    color: loading == true ? color.red : color.white
                  }}
                >
                  Save
                </Text>
              </> :
              <ActivityIndicator color={color.white} size='small' />
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

async function schedulePushNotification () {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Post saved',
      body: 'Yippee!! Your post has been saved successfully',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  })
}

async function registerForPushNotificationsAsync () {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}

export default SaveReels
// in use