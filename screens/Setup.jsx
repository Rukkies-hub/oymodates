import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable
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

import { useNavigation } from '@react-navigation/native'

const intrestsList = [
  "karaoke",
  "cycling",
  "swimming",
  "cat lover",
  "dog lover",
  "environmentalism",
  "running",
  "outdoors",
  "trivia",
  "grap a drink",
  "museum",
  "gammer",
  "soccer",
  "netflix",
  "sports",
  "working out",
  "comedy",
  "spirituality",
  "board games",
  "cooking",
  "wine",
  "foodie",
  "hiking",
  "politics",
  "writer",
  "travel",
  "golf",
  "reading",
  "movies",
  "athlete",
  "baking",
  "plant-based",
  "vlogging",
  "gardening",
  "fishing",
  "art",
  "brunch",
  "climbing",
  "tea",
  "walking",
  "blogging",
  "volunteering",
  "astrology",
  "yoga",
  "instagram",
  "language exchange",
  "surfing",
  "craft beer",
  "shopping",
  "DIY",
  "dancing",
  "disney",
  "fashion",
  "music",
  "photography",
  "picnicking",
  "coffie"
]

import { useFonts } from 'expo-font'
import color from '../style/color'

const Setup = () => {
  const { user } = useAuth()
  const navigation = useNavigation()

  const [userProfile, setUserProfile] = useState({})
  const [name, setName] = useState("")
  const [nameLoading, setNameLoading] = useState(false)
  const [showName, setShowName] = useState(true)
  const [showPhoto, setShowPhoto] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [showOccupation, setShowOccupation] = useState(false)
  const [occupation, setOccupation] = useState("")
  const [occupationLoading, setOccupationLoading] = useState(false)
  const [showIntrests, setShowIntrests] = useState(false)
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
        setIntrests(doc.data()?.intrests?.length ? doc.data()?.intrests : [])
      })
  }

  useEffect(() =>
    getUserProfile(user)
    , [])

  useLayoutEffect(() => {
    if (userProfile.name) {
      setShowName(false)
      setShowPhoto(true)
    }
    if (userProfile.name && userProfile.avatar?.length >= 3) {
      setShowPhoto(false)
      setShowLocation(true)
    }
    if (userProfile.name && userProfile.avatar?.length && userProfile.address) {
      setShowLocation(false)
      setShowOccupation(true)
    }
    if (userProfile.name && userProfile.avatar?.length && userProfile.address && userProfile.occupation) {
      setShowOccupation(false)
      setShowIntrests(true)
    }
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
          }).then(() => getUserProfile(user))
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
        setShowLocation(false)
        setShowOccupation(true)
        getUserProfile(user)
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
        })
        .then(() => {
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

  const updateIntrests = () => {
    if (intrests.length) {
      setIntrestsLoading(true)
      firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          intrests
        })
        .then(() => {
          getUserProfile(user)
          setIntrestsLoading(false)
          navigation.goBack()
        })
        .catch(() => setOccupationLoading(false))
    }
  }

  const [loaded] = useFonts({
    header: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null


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
                  <MaterialCommunityIcons name='chevron-right' color={color.dark} size={30} />
                </TouchableOpacity>
              }
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: color.dark,
                    fontFamily: "header"
                  }}
                >
                  Update you name
                </Text>
              </View>
              <View style={editProfile.form}>
                <View
                  style={{
                    height: 50,
                    marginBottom: 30,
                    borderWidth: 1,
                    borderColor: color.borderColor,
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
                      width: "100%",
                      color: color.dark,
                      fontFamily: "header"
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={updateName}
                  style={{
                    backgroundColor: color.red,
                    height: 50,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {
                    nameLoading ?
                      <ActivityIndicator size="small" color={color.white} />
                      :
                      <Text
                        style={{
                          color: color.white,
                          fontSize: 18,
                          fontFamily: "header"
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
            showPhoto == true &&
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
                <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: userProfile.avatar?.length ? 20 : 0
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: color.dark,
                    fontFamily: "header"
                  }}
                >
                  Add your picture
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: color.dark,
                    textAlign: "center"
                  }}
                >
                  NOTE. the first image will be used as your account avatar
                </Text>
              </View>
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
                              backgroundColor: color.offWhite,
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
                                backgroundColor: color.white,
                                borderRadius: 50,
                                shadowColor: color.dark,
                                shadowOffset: {
                                  width: 0,
                                  height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                              }}
                            >
                              <MaterialCommunityIcons name='close' color={color.red} size={22} />
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
                          backgroundColor: color.red,
                          borderRadius: 12,
                          justifyContent: "center",
                          alignItems: "center",
                          fontFamily: "header"
                        }}
                      >
                        <Text style={{ color: color.white, fontSize: 18 }}>Add Photo</Text>
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
                        backgroundColor: color.offWhite,
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                        fontFamily: "header"
                      }}
                    >
                      <Text style={{ color: color.dark, fontSize: 18 }}>Done</Text>
                    </TouchableOpacity>
                  }
                </View>
              }
            </View>
          }
          {
            showLocation == true &&
            <View
              style={{
                flex: 1,
                backgroundColor: color.white,
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
                <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
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
                  borderColor: color.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                }}
              >
                {
                  address == null ?
                    <Text
                      style={{
                        fontFamily: "header"
                      }}
                    >
                      Waiting...
                    </Text>
                    : <Text
                      style={{
                        fontFamily: "header"
                      }}
                    >
                      {address?.subregion}, {address?.country}
                    </Text>
                }
              </View>
              <View
                style={{
                  width: "100%",
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
                    backgroundColor: color.offWhite,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    fontFamily: "header"
                  }}
                >
                  <Text style={{ color: color.dark, fontSize: 18 }}>Get location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveLocation}
                  style={{
                    width: "48%",
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: color.red,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    fontFamily: "header"
                  }}
                >
                  {
                    locationLoading ? <ActivityIndicator size="small" color={color.white} />
                      : <>
                        <MaterialCommunityIcons name='google-maps' size={20} color={color.white} />
                        <Text style={{ color: color.white, fontSize: 18, marginLeft: 10 }}>Update</Text>
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
                backgroundColor: color.white,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                paddingHorizontal: 10
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowName(false)
                  setShowPhoto(false)
                  setShowOccupation(false)
                  setShowLocation(true)
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
                <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
              </TouchableOpacity>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: color.dark,
                    fontFamily: "header"
                  }}
                >
                  What do you do
                </Text>
              </View>

              <View style={editProfile.form}>
                <View
                  style={{
                    height: 50,
                    marginBottom: 30,
                    borderWidth: 1,
                    borderColor: color.borderColor,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TextInput
                    placeholder="I am a (occupation)"
                    value={occupation}
                    onChangeText={setOccupation}
                    style={{
                      width: "100%",
                      fontFamily: "header"
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={updateOccupation}
                  style={{
                    backgroundColor: color.red,
                    height: 50,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "header"
                  }}
                >
                  {
                    occupationLoading ?
                      <ActivityIndicator size="small" color={color.white} />
                      :
                      <Text
                        style={{
                          color: color.white,
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
                backgroundColor: color.white,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                paddingHorizontal: 10
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowName(false)
                  setShowPhoto(false)
                  setShowLocation(false)
                  setShowIntrests(false)
                  setShowOccupation(true)
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
                <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: color.dark,
                    fontFamily: "header"
                  }}
                >
                    What are your pashions
                    {
                      intrests.length ? <Text>[{intrests.length}/5]</Text> : <Text style={{display: "none"}}></Text>
                    }
                </Text>
              </View>
              <View style={editProfile.form}>
                <ScrollView
                  style={{
                    maxHeight: 500,
                    minHeight: 400,
                    marginBottom: 20
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      alignItems: "flex-start"
                    }}
                  >
                    {
                      intrestsList.map((pashion, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (intrests.includes(pashion))
                                setIntrests(intrests.filter(item => item !== pashion))
                              else if (intrests.length <= 4)
                                setIntrests(oldArray => [...oldArray, pashion])
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: intrests?.includes(pashion) ? color.red : "rgba(0,0,0,0.1)",
                              marginBottom: 10,
                              marginRight: 10
                            }}
                          >
                            <Text
                              style={{
                                color: intrests?.includes(pashion) ? color.red : "rgba(0,0,0,0.6)",
                                fontSize: 12,
                                fontFamily: "header",
                                textTransform: "capitalize"
                              }}
                            >
                              {pashion}
                            </Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                </ScrollView>

                <TouchableOpacity
                  onPress={updateIntrests}
                  style={{
                    backgroundColor: color.red,
                    height: 50,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {
                    intrestsLoading ?
                      <ActivityIndicator size="small" color={color.white} />
                      :
                      <Text
                        style={{
                          color: color.white,
                          fontSize: 18,
                          fontFamily: "header"
                        }}
                      >
                        Update pashion
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