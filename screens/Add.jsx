import React, { useState, useEffect } from 'react'
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
  UIManager
} from 'react-native'
import Header from '../components/Header'
import color from '../style/color'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useFonts } from 'expo-font'

import * as ImagePicker from "expo-image-picker"
import useAuth from '../hooks/useAuth'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import { db } from '../hooks/firebase'
import { serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'

const Add = () => {
  const { user } = useAuth()
  const storage = getStorage()
  const [input, setInput] = useState("")
  const [height, setHeight] = useState(50)
  const [image, setImage] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.uri)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', result.uri, true)
        xhr.send(null)
      })

      const photoRef = ref(storage, `posts/${new Date().toISOString()}`)

      const uploadTask = uploadBytesResumable(photoRef, blob)

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
        () => getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setImage(downloadURL))
      )
    }
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!")
      return
    }

    const result = await ImagePicker.launchCameraAsync()

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  useEffect(() =>
    Keyboard.addListener("keyboardDidShow", () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setMediaVidiblity(false)
    })
    , [])

  useEffect(() =>
    Keyboard.addListener('keyboardDidHide', () => {
      setExpanded(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setMediaVidiblity(true)
    })
    , [])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white,
        position: 'relative'
      }}
    >
      <Header
        showBack
        showTitle
        showPost
        postDetails={{
          image,
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
          <View
            style={{
              maxHeight: 300,
              overflow: 'hidden',
              paddingHorizontal: 10
            }}
          >
            <TextInput
              multiline
              value={input}
              onChangeText={setInput}
              placeholder="What's on your mind"
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              style={{
                height,
                backgroundColor: color.white,
                maxHeight: 300,
                fontSize: 18
              }}
            />
          </View>
        </TouchableWithoutFeedback>

        {
          image != '' &&
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <View
              style={{
                width: '100%'
              }}
            >
              <Image
                source={{ uri: image }}
                style={{
                  width: '100%',
                  height: 400
                }}
              />
            </View>

            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: '100%',
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.blue
                }}
              >
                Add more
              </Text>
            </TouchableOpacity>
          </View>
        }
      </ScrollView>

      {
        mediaVidiblity &&
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            borderTopWidth: 1,
            borderTopColor: color.borderColor,
            paddingHorizontal: 10
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: '100%',
              height: 50,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: color.white
            }}
          >
            <FontAwesome5 name='image' size={20} color={color.green} />
            <Text
              style={{
                color: color.dark,
                fontFamily: 'text',
                marginLeft: 10
              }}
            >
              Photo/Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
              setExpanded(!expanded)
            }}
            style={{
              width: '100%',
              height: 50,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderTopWidth: 1,
              borderTopColor: color.borderColor,
              backgroundColor: color.white
            }}
          >
            <FontAwesome5 name='camera' size={20} color={color.blue} />
            <Text
              style={{
                color: color.dark,
                fontFamily: 'text',
                marginLeft: 10
              }}
            >
              Camera
            </Text>
          </TouchableOpacity>
        </View>
      }

      {
        expanded &&
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            flex: 1,
            backgroundColor: color.borderColor,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              borderRadius: 20,
              backgroundColor: color.white,
              paddingHorizontal: 10,
              paddingBottom: 10,
              width: '80%'
            }}
          >
            <View
              style={{
                width: '100%',
                height: 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10
              }}
            >
              <Text
                style={{
                  fontFamily: 'text'
                }}
              >
                Select camera
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                setExpanded(!expanded)
              }}
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: color.blue,
                  fontFamily: 'text'
                }}
              >
                App camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                openCamera()
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                setExpanded(!expanded)
              }}
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: color.dark,
                  fontFamily: 'text'
                }}
              >
                Device camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                setExpanded(!expanded)
              }}
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                backgroundColor: color.faintRed,
                marginTop: 10
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.red
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </View>
  )
}

export default Add