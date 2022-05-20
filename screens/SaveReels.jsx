import React, { useState } from 'react'
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
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'

import uuid from 'uuid-random'

let file
let link

const SaveReels = (params) => {
  const { userProfile, user } = useAuth()
  const navigation = useNavigation()
  const source = params?.route?.params?.source

  const storage = getStorage()

  link = `reels/${user.uid}/${uuid()}`

  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  let uploadTask
  const saveReel = async () => {
    setLoading(true)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', source, true)
      xhr.send(null)
    })

    const mediaRef = ref(storage, link)

    uploadTask = uploadBytesResumable(mediaRef, blob)

    uploadTask.on('state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${Math.floor(progress)}% done`)

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
        getDownloadURL(uploadTask.snapshot.ref)
          .then(downloadURL => {
            file = downloadURL
            setLoading(true)
            addDoc(collection(db, 'reels'), {
              user: {
                id: user?.uid,
                photoURL: userProfile?.photoURL,
                displayName: userProfile?.displayName
              },
              media: file,
              mediaLink: link,
              description,
              likesCount: 0,
              commentsCount: 0,
              timestamp: serverTimestamp()
            })
              .finally(() => {
                setLoading(false)
                setDescription('')
                navigation.navigate('Reels')
              })
          })
      }
    )
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
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
          style={{
            paddingVertical: 10,
            marginRight: 20,
            flex: 1
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
            borderColor: color.borderColor,
            borderWidth: 1,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginRight: 5
          }}
        >
          <Feather name="x" size={24} color="black" />
          <Text
            style={{
              fontFamily: 'text',
              marginLeft: 10
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
            backgroundColor: loading == true ? color.faintRed : color.red,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginLeft: 5
          }}
        >

          {
            !loading ?
              <>
                <Feather name="corner-left-up" size={24} color={loading == true ? color.red : color.white} />
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
              <ActivityIndicator color={loading == true ? color.red : color.white} size='small' />
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SaveReels