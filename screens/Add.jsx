import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'

import { useNavigation } from '@react-navigation/native'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import useAuth from "../hooks/useAuth"
import firebase from "../hooks/firebase"

const Add = () => {
  const { user, userProfile } = useAuth()
  const hasPermission = useCameraPermission()
  const { cameraStyle, contentStyle } = useFullScreenCameraStyle()
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [camera, setCamera] = useState(null)
  const [image, setImage] = useState("")
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const [caption, setCaption] = useState("")
  const [uploadLoading, setUploadLoading] = useState(false)
  const [cameraVisible, setCameraVisible] = useState(true)

  const navigation = useNavigation()

  if (hasPermission === null)
    return <View />

  if (hasPermission === false)
    return <Text>No access to camera</Text>

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      setImage(data.uri)
      setFlash(Camera.Constants.FlashMode.off)
    }
  }

  const pickImage = async () => {
    setCameraVisible(false)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    })

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
      // setUploadLoading(true)
    }, (error) => {
      // setUploadLoading(false)
      blob.close()
      return
    }, () => {
      snapshot.snapshot.ref.getDownloadURL().then(url => {
        // setUploadLoading(false)

        firebase.firestore()
          .collection("posts")
          .doc()
          .set({
            media: image,
            caption,
            user: userProfile,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })

        navigation.navigate("Index")

        blob.close()
        return url
      })
    })
  }


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="light" />
      {
        image == "" ? (
          cameraVisible &&
          <Camera style={[styles.cover, cameraStyle]} type={type} flashMode={flash} ref={ref => setCamera(ref)}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                position: "relative",
                width: "100%",
                height: "100%"
              }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  position: "absolute",
                  left: 110,
                  top: 30,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <SimpleLineIcons name="arrow-left" color="#fff" size={20} />
              </TouchableOpacity>
              <View
                style={{
                  position: "absolute",
                  top: 30,
                  right: 110,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  alignContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 50
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setTimeout(() => {
                      takePicture()
                    }, 5000)
                  }}
                  style={{
                    marginBottom: 10
                  }}
                >
                  <MaterialCommunityIcons name="camera-timer" color="#fff" size={26} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFlash(
                      flash === Camera.Constants.FlashMode.off
                        ? Camera.Constants.FlashMode.torch
                        : Camera.Constants.FlashMode.off)
                  }}
                  style={{
                    marginBottom: 10
                  }}
                >
                  <MaterialCommunityIcons name={flash === Camera.Constants.FlashMode.off ? "lightning-bolt" : "lightning-bolt-outline"} color="#fff" size={26} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    )
                  }}>
                  <MaterialCommunityIcons name="camera-front" color="#fff" size={26} />
                </TouchableOpacity>
              </View>

              <View style={{
                width: "100%",
                height: 80,
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.2)",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10
                  }}>
                  <MaterialCommunityIcons name="cards" color="#fff" size={36} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => takePicture()}
                  style={{
                    width: 70,
                    height: 70,
                    borderWidth: 3,
                    borderColor: "#fff",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 10
                  }}>
                  <MaterialCommunityIcons name="cards" color="#fff" size={36} />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              flex: 1
            }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ImageBackground
                source={{ uri: image }}
                resizeMode="cover"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  position: "relative"
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setImage("")
                    setCameraVisible(true)
                  }}
                  style={{
                    position: "absolute",
                    top: 30,
                    left: 10,
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <MaterialCommunityIcons name="window-close" color="#fff" size={26} />
                </TouchableOpacity>

                <View
                  style={{
                    flex: 1,
                    position: "absolute",
                    bottom: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    marginBottom: 20,
                  }}
                >
                  <TextInput
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="Write a caption"
                    style={{
                      flex: 1,
                      backgroundColor: "#fff",
                      minHeight: 50,
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                      paddingHorizontal: 15
                    }}
                  />
                  <TouchableOpacity
                    onPress={uploadPost}
                    style={{
                      height: 50,
                      backgroundColor: "#fff",
                      width: 80,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                      paddingHorizontal: 10
                    }}>
                    <Text style={{ marginRight: 10, fontSize: 18, textTransform: "capitalize" }}>Post</Text>
                    {
                      uploadLoading == true ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                      ) : (
                        <SimpleLineIcons name="magic-wand" color="#000" size={20} />
                      )
                    }
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )
      }
    </View>
  )
}

function useCameraPermission () {
  const [hasPermission, setPermission] = useState(null)

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(
      response => setPermission(response.status === 'granted')
    )
  }, [])

  return hasPermission
}

/**
 * Calculate the width and height of a full screen camera.
 * This approach emulates a `cover` resize mode.
 * Because the `<Camera>` is also a wrapping element, 
 * we also need to calculate the offset back for the content.
 * 
 * @see https://reactnative.dev/docs/image#resizemode
 * @see https://github.com/react-native-camera/react-native-camera/issues/1267#issuecomment-376937499
 */
function useFullScreenCameraStyle (ratio = 3 / 4) {
  const window = useWindowDimensions()
  const isPortrait = window.height >= window.width
  let cameraStyle, contentStyle

  if (isPortrait) {
    // If the device is in portrait mode, we need to increase the width and move it out of the screen
    const widthByRatio = window.height * ratio
    const widthOffsetByRatio = -((widthByRatio - window.width) / 2)

    // The camera is scaled up to "cover" the full screen, while maintainin ratio
    cameraStyle = { left: widthOffsetByRatio, right: widthOffsetByRatio }
    // But because the camera is also a wrapping element, we need to reverse this offset to align the content
    contentStyle = { left: -widthOffsetByRatio, right: -widthOffsetByRatio }
  } else {
    // If the device is in landscape mode, we need to increase the height and move it out of the screen
    const heightByRatio = window.width * ratio
    const heightOffsetByRatio = -((heightByRatio - window.height) / 2)

    // See portrait comments
    cameraStyle = { top: heightOffsetByRatio, bottom: heightOffsetByRatio }
    contentStyle = { top: -heightOffsetByRatio, bottom: -heightOffsetByRatio }
  }

  return { cameraStyle, contentStyle }
}


const styles = StyleSheet.create({
  cover: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
})


export default Add
