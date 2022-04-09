import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'

import useAuth from "../hooks/useAuth"
import firebase from "../hooks/firebase"

import { useNavigation } from '@react-navigation/native'

import Bar from "./StatusBar"

const Add = () => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()

  const [height, setHeight] = useState(50)
  const [image, setImage] = useState("")
  const [caption, setCaption] = useState("")
  const [uploadLoading, setUploadLoading] = useState(false)

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1
    })

    // Explore the result
    console.log(result)

    if (!result.cancelled)
      setImage(result.uri)

  }

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled)
      setImage(result.uri)
  }

  const uploadPost = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }

      xhr.responseType = "blob"
      xhr.open("GET", image, true)
      xhr.send(null)
    })

    const ref = firebase.storage().ref().child(`posts/${new Date().toISOString()}`)
    const snapshot = ref.put(blob)

    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
      setUploadLoading(true)
    }, (error) => {
      setUploadLoading(false)
      blob.close()
      return
    }, () => {
      snapshot.snapshot.ref.getDownloadURL().then(url => {
        setUploadLoading(false)

        firebase.firestore()
          .collection("posts")
          .doc()
          .set({
            media: url,
            caption,
            user: userProfile,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })

        if (uploadLoading == false)
          navigation.navigate("Feed")

        blob.close()
        return url
      })
    })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#fff"
          }}
        >
          <Bar />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingHorizontal: 10,
              borderBottomWidth: .3,
              backgroundColor: "#fff",
              minHeight: 50,
              overflow: "hidden",
              marginTop: 10
            }}
          >
            <TextInput
              multiline
              value={caption}
              onChangeText={setCaption}
              placeholder="What's or nur mind.."
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              style={{ fontSize: 18, flex: 1, width: "100%", height: height, maxHeight: 70 }}
            />

            <TouchableOpacity
              onPress={uploadPost}
              style={{
                width: 40,
                height: 50,
                justifyContent: "center",
                alignItems: "center"
              }}>
              {
                uploadLoading == true ? (<ActivityIndicator size="small" color="rgba(0,0,0,0.8)" />)
                  : (<Text>Post</Text>)
              }
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 50,
              width: "100%",
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginHorizontal: 10
            }}
          >
            <TouchableOpacity
              onPress={openCamera}
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: 10,
                marginRight: 10,
                height: 40,
                borderRadius: 12
              }}
            >
              <SimpleLineIcons name="camera" color="rgba(0,0,0,0.6)" size={20} />
              <Text style={{ marginLeft: 10 }}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showImagePicker}
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: 10,
                marginRight: 10,
                height: 40,
                borderRadius: 12
              }}
            >
              <SimpleLineIcons name="picture" color="rgba(0,0,0,0.6)" size={20} />
              <Text style={{ marginLeft: 10 }}>Add photo</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <Image
              source={{ uri: image }}
              resizeMode="contain"
              style={{
                width: 100,
                height: 100
              }}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Add