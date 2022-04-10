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

import Constants from 'expo-constants'
import * as Location from 'expo-location'


const Setup = () => {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState({})
  const [name, setName] = useState("")
  const [nameLoading, setNameLoading] = useState(false)
  const [showName, setShowName] = useState(true)
  const [showPhoto, setShowPhoto] = useState(true)
  const [showLocation, setShowLocation] = useState(true)
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [showOccupation, setShowOccupation] = useState(true)
  const [occupation, setOccupation] = useState("")
  const [occupationLoading, setOccupationLoading] = useState(false)
  const [showIntrests, setShowIntrests] = useState(true)
  const [intrests, setIntrests] = useState([])
  const [intrestsLoading, setIntrestsLoading] = useState(false)

  const getUserProfile = async (user) => {
    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        setUserProfile(doc?.data())
        setName(doc.data()?.name)
        setAddress(doc.data()?.address)
        setOccupation(doc.data()?.occupation)
      })
  }

  useEffect(() =>
    getUserProfile(user)
    , [])

  useLayoutEffect(() => {
    if (userProfile.name)
      setShowName(false)
    if (userProfile.name && userProfile.avatar?.length)
      setShowPhoto(false)
    if (userProfile.name && userProfile.avatar?.length && userProfile.address)
      setShowLocation(false)
    if (userProfile.name && userProfile.avatar?.length && userProfile.address && userProfile.occupation)
      setShowOccupation(false)
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

  const getLocation = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
      )
      return
    }
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    const address = await Location.reverseGeocodeAsync(location.coords)
    setLocation(location)
    setAddress(...address)
  }

  let text = 'Waiting..'
  if (errorMsg)
    text = errorMsg;
  else if (location)
    text = JSON.stringify(location)

  const saveLocation = () => {
    if (address != null && location != null)
      setLocationLoading(true)
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        location,
        address
      }).then(() => {
        setLocationLoading(false)
      })
      .catch(error => setLocationLoading(false))
  }

  const updateOccupation = async () => {
    if (occupation != "") {
      setOccupationLoading(true)
      await firebase.firestore()
        .collection("users")
        .doc(`${user.uid}`)
        .update({
          occupation
        }).then(() => {
          setOccupationLoading(false)
          getUserProfile(user)
          setShowName(false)
          setShowPhoto(false)
          setShowLocation(false)
          setShowOccupation(false)
          setShowIntrests(true)
        })
        .catch(() => setOccupationLoading(false))
    }
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
                        Update name
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
                      onPress={() => {
                        setShowName(false)
                        setShowPhoto(false)
                        setShowLocation(true)
                      }}
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
          {
            (showName == false && showPhoto == false && showLocation == true) &&
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                paddingHorizontal: 10
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowName(false)
                  setShowLocation(false)
                  setShowPhoto(true)
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
              <Image
                style={{
                  width: 200,
                  height: 200
                }}
                source={require("../assets/location.png")}
              />
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  minHeight: 50,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                }}
              >
                {
                  address == null ? <Text>Waiting...</Text>
                    : <Text>
                      {address?.subregion}, {address?.country}
                    </Text>
                }
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={getLocation}
                  style={{
                    width: "48%",
                    height: 50,
                    backgroundColor: "#F0F2F5",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20
                  }}
                >
                  <Text style={{ color: "#000", fontSize: 18 }}>Get location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveLocation}
                  style={{
                    width: "48%",
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: "#FF4757",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20
                  }}
                >
                  {
                    locationLoading ? <ActivityIndicator size="small" color="#fff" />
                      : <>
                        <MaterialCommunityIcons name='google-maps' size={20} color="#fff" />
                        <Text style={{ color: "#fff", fontSize: 18, marginLeft: 10 }}>Update</Text>
                      </>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          {
            showOccupation == true &&
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                paddingHorizontal: 10
              }}
            >
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
                    placeholder="Occupation"
                    value={occupation}
                    onChangeText={setOccupation}
                    style={{
                      width: "100%"
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={updateOccupation}
                  style={{
                    backgroundColor: "#FF4757",
                    height: 50,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {
                    occupationLoading ?
                      <ActivityIndicator size="small" color="#fff" />
                      :
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 18
                        }}
                      >
                        Update occupation
                      </Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          {
            showIntrests == true &&
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                paddingHorizontal: 10
              }}
            >
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
                    placeholder="Occupation"
                    value={occupation}
                    onChangeText={setOccupation}
                    style={{
                      width: "100%"
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={updateOccupation}
                  style={{
                    backgroundColor: "#FF4757",
                    height: 50,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {
                    intrestsLoading ?
                      <ActivityIndicator size="small" color="#fff" />
                      :
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 18
                        }}
                      >
                        Update intrests
                      </Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Setup