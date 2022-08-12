import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import AutoHeightImage from 'react-native-auto-height-image'
import useAuth from '../../hooks/useAuth'
import color from '../../style/color'
import { useFonts } from 'expo-font'
import { Feather } from '@expo/vector-icons'

import uuid from 'uuid-random'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

const { width } = Dimensions.get('window')

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const SaveAvatar = () => {
  const { theme, userProfile } = useAuth()
  const { result } = useRoute().params
  const navigation = useNavigation()

  const storage = getStorage()

  const [loading, setLoading] = useState(false)

  // notification
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const saveAvatar = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', result?.uri, true)
      xhr.send(null)
    })

    const link = `avatars/${userProfile?.id}/${uuid()}`

    const photoRef = ref(storage, link)

    if (result?.uri && result?.type == 'image') {
      if (userProfile?.photoURL) {
        setLoading(true)
        const deleteAvatarRef = ref(storage, userProfile?.photoLink)

        deleteObject(deleteAvatarRef)
          .then(() => {
            uploadBytes(photoRef, blob)
              .then(snapshot => {
                getDownloadURL(snapshot?.ref)
                  .then(downloadURL => {
                    updateDoc(doc(db, 'users', userProfile?.id), {
                      photoURL: downloadURL,
                      photoLink: link
                    }).then(() => {
                      navigation.goBack()
                      schedulePushNotification('Update successful', 'Your display picture has been updated successfully')
                      setLoading(false)
                    }).catch(() => setLoading(false))
                  })
              })
          })
      } else {
        setLoading(true)
        uploadBytes(photoRef, blob)
          .then(snapshot => {
            getDownloadURL(snapshot?.ref)
              .then(downloadURL => {
                updateDoc(doc(db, 'users', userProfile?.id), {
                  photoURL: downloadURL,
                  photoLink: link
                }).then(() => {
                  navigation.goBack()
                  schedulePushNotification('Update successful', 'Your display picture has been updated successfully')
                  setLoading(false)
                }).catch(() => setLoading(false))
              })
          })
      }
    }
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,

        justifyContent: 'space-between'
      }}
    >
      <AutoHeightImage
        width={width}
        source={{ uri: result?.uri }}
        style={{
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderColor: theme == 'dark' ? color.lightBorderColor : color.borderColor,
            borderWidth: 1,
            borderRadius: 8,
            height: 45,
            marginRight: 5
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: theme == 'dark' ? color.white : color.dark
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveAvatar}
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
    </View>
  )
}

async function schedulePushNotification (title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: require('../../assets/newMessage.mp3')
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

export default SaveAvatar