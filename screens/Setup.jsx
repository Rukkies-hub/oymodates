import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
  Image
} from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'

import editProfile from '../style/editProfile'

import firebase from "../hooks/firebase"

import useAuth from '../hooks/useAuth'

import { FlatGrid } from 'react-native-super-grid'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import * as ImagePicker from 'expo-image-picker'


const Setup = () => {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState({})
  const [name, setName] = useState("")
  const [nameLoading, setNameLoading] = useState(false)
  const [showName, setShowName] = useState(true)
  const [showPhoto, setShowPhoto] = useState(true)

  const getUserProfile = async (user) => {
    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        setUserProfile(doc?.data())
        setName(doc.data()?.name)
      })
  }

  useEffect(() =>
    getUserProfile(user)
    , [])

  useLayoutEffect(() => {
    if (userProfile.name)
      setShowName(false)
    // if (userProfile.name && userProfile.avatar?.length)
    //   setShowPhoto(false)
  }, [userProfile.name, userProfile.avatar?.length])

  const updateName = async () => {
    if (name != "") {
      setNameLoading(true)
      await firebase.firestore()
        .collection("users")
        .doc(`${user.uid}`)
        .update({
          name
        }).then(() => {
          setNameLoading(false)
          getUserProfile(user)
          setShowName(false)
          setShowPhoto(true)
        }).catch(() => setNameLoading(false))
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })

    if (!result.cancelled) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
          resolve(xhr.response)
        }

        xhr.responseType = "blob"
        xhr.open("GET", result.uri, true)
        xhr.send(null)
      })

      const ref = firebase.storage().ref().child(`avatars/${new Date().toISOString()}`)
      const snapshot = ref.put(blob)

      snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
        // setupLoadeding(true)
      }, (error) => {
        // setupLoadeding(false)
        blob.close()
        return
      }, () => {
        snapshot.snapshot.ref.getDownloadURL().then(url => {
          // setupLoadeding(false)

          firebase.firestore()
            .collection("users")
            .doc(`${user.uid}`)
            .update({
              avatar: firebase.firestore.FieldValue.arrayUnion(url)
            }).then(() => {
              getUserProfile(user)
            })

          blob.close()
          return url
        })
      })
    }
  }

  const deleteImage = (image) => {
    const fileRef = firebase.storage().refFromURL(image)

    fileRef.delete()
      .then(() => {
        firebase.firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            avatar: firebase.firestore.FieldValue.arrayRemove(image)
          })
          .then(() => {
            getUserProfile(user)
          })
      })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: "#fff"
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          {
            showName == true &&
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                position: "relative"
              }}
            >
              {
                userProfile.name &&
                <TouchableOpacity
                  onPress={() => {
                    setShowName(false)
                    setShowPhoto(true)
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 10,
                    right: 10
                  }}
                >
                  <MaterialCommunityIcons name='chevron-right' color="#000" size={30} />
                </TouchableOpacity>
              }
              <View style={editProfile.form}>
                <View
                  style={{
                    height: 50,
                    marginBottom: 30,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.2)",
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={{
                      width: "100%"
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={updateName}
                  style={{
                    backgroundColor: "#FF4757",
                    height: 50,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {
                    nameLoading ?
                      <ActivityIndicator size="small" color="#fff" />
                      :
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 18
                        }}
                      >
                        Update Name
                      </Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          {
            (showName == false && showPhoto == true) &&
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                position: "relative"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowPhoto(false)
                  setShowName(true)
                }}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: 10,
                  left: 10
                }}
              >
                <MaterialCommunityIcons name='chevron-left' color="#000" size={30} />
              </TouchableOpacity>
              {
                userProfile.avatar?.length != 9 &&
                <View style={{ paddingHorizontal: 10 }}>
                  {
                    userProfile.avatar?.length >= 1 &&
                    <FlatGrid
                      itemDimension={100}
                      data={userProfile.avatar}
                      renderItem={({ item: image }) => (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                          }}
                        >
                          <View
                            style={{
                              position: "relative",
                              width: "100%",
                              height: 150,
                              backgroundColor: "#F0F2F5",
                              borderRadius: 12,
                              overflow: "hidden"
                            }}
                          >
                            <Image
                              source={{ uri: image }}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                flex: 1,
                                width: "100%",
                                height: "100%"
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => deleteImage(image)}
                              style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                backgroundColor: "#fff",
                                borderRadius: 50,
                                shadowColor: "#000",
                                shadowOffset: {
                                  width: 0,
                                  height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                              }}
                            >
                              <MaterialCommunityIcons name='close' color="#FF4757" size={22} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    />
                  }
                  {
                    userProfile.avatar?.length != 9 ?
                      <TouchableOpacity
                        onPress={pickImage}
                        style={{
                          width: "100%",
                          height: 50,
                          backgroundColor: "#FF4757",
                          borderRadius: 12,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 18 }}>Add Photo</Text>
                      </TouchableOpacity>
                      : null
                  }
                  {
                    userProfile.avatar?.length >= 3 &&
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        width: "100%",
                        height: 50,
                        backgroundColor: "#F0F2F5",
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20
                      }}
                    >
                      <Text style={{ color: "#000", fontSize: 18 }}>Done</Text>
                    </TouchableOpacity>
                  }
                </View>
              }
            </View>
          }
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Setup