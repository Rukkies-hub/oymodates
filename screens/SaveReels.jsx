import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import color from '../style/color'
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native'

import { MaterialIcons, Entypo, Feather } from '@expo/vector-icons'

import { useFonts } from 'expo-font'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'

import uuid from 'uuid-random'
import Bar from '../components/StatusBar'

const SaveReels = (params) => {
  const { userProfile, user } = useAuth()
  const navigation = useNavigation()
  const source = params?.route?.params?.source
  const thumbnail = params?.route?.params?.thumbnail

  const storage = getStorage()

  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const saveReel = async () => {
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

    const sourceRef = ref(storage, `reels/${user?.uid}/video/${uuid()}`)

    const thumbnailRef = ref(storage, `reels/${user?.uid}/thumbnail/${uuid()}`)

    uploadBytes(sourceRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref)
          .then(downloadURL => {
            uploadBytes(thumbnailRef, thumbnailBlob)
              .then(thumbnailSnapshot => {
                getDownloadURL(thumbnailSnapshot.ref)
                  .then(thumbnailDownloadURL => {
                    addDoc(collection(db, 'reels'), {
                      user: {
                        id: user?.uid,
                        photoURL: userProfile?.photoURL,
                        displayName: userProfile?.displayName,
                        username: userProfile?.username,
                      },
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
                      navigation.navigate('Reels')
                    })
                  })
              })
          })
      })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

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
          placeholderTextColor={userProfile?.theme == 'light' ? color.dark : color.white}
          style={{
            paddingVertical: 10,
            marginRight: 20,
            flex: 1,
            color: userProfile?.theme == 'light' ? color.dark : color.white
          }}
        />
        <Image
          style={{
            aspectRatio: 9 / 16,
            backgroundColor: color.black,
            width: 60
          }}
          source={{ uri: source }}
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
            borderColor: userProfile?.theme == 'light' ? color.borderColor : color.lightBorderColor,
            borderWidth: 1,
            borderRadius: 12,
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
          disabled={loading == true}
          onPress={saveReel}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: color.red,
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 20,
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
                  Post
                </Text>
              </> :
              <ActivityIndicator color={color.white} size='small' />
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SaveReels