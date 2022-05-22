import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native'

import Constants from 'expo-constants'
import * as Location from 'expo-location'

import Header from '../components/Header'

import color from '../style/color'

import useAuth from '../hooks/useAuth'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useFonts } from 'expo-font'

import DatePicker from 'react-native-datepicker'

import * as ImagePicker from 'expo-image-picker'

import moment from 'moment'

import { useNavigation } from '@react-navigation/native'

import { db } from '../hooks/firebase'

import { serverTimestamp, setDoc, doc, updateDoc } from 'firebase/firestore'

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

import { RadioButton } from "react-native-paper"

let link = `avatars/${new Date().toISOString()}`

const EditProfile = () => {
  const {
    user,
    logout,
    userProfile,
    date,
    setDate,
    job,
    setJob,
    image,
    setImage,
    username,
    setUsername,
    school,
    setSchool,
    getUserProfile,
    company,
    setCompany,
    city,
    setCity,
    checked,
    setChecked,
    about,
    setAbout,
    passions,
    address,
    setAddress
  } = useAuth()
  const storage = getStorage()
  const navigation = useNavigation()

  const [height, setHeight] = useState(50)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)

  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.cancelled) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', result.uri, true)
        xhr.send(null)
      })

      const photoRef = ref(storage, link)

      const uploadTask = uploadBytesResumable(photoRef, blob)

      if (result?.uri) {
        if (userProfile?.photoURL) {
          setUploadLoading(true)
          const desertRef = ref(storage, userProfile?.photoLink)

          deleteObject(desertRef)
            .then(() => {
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
                error => {
                  setUploadLoading(false)
                  console.log('error uploading image: ', error)
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      setImage(downloadURL)
                      updateDoc(doc(db, 'users', user?.uid), {
                        photoURL: downloadURL,
                        photoLink: link
                      }).finally(() => {
                        getUserProfile(user)
                        setUploadLoading(false)
                      })
                    })
                }
              )
            })
            .catch((error) => {
              setUploadLoading(false)
              console.log('error: ', error)
            })
        }
        else {
          setUploadLoading(true)
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
            error => {
              setUploadLoading(false)
              console.log('error uploading image: ', error)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  const getLocation = async () => {
                    if (Platform.OS === "android" && !Constants.isDevice) {
                      setErrorMsg(
                        "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
                      )
                      return
                    }
                    let { status } = await Location.requestForegroundPermissionsAsync()
                    if (status !== "granted") {
                      setErrorMsg("Permission to access location was denied")
                      return
                    }

                    let location = await Location.getCurrentPositionAsync({})
                    const address = await Location.reverseGeocodeAsync(location.coords)
                    setLocation(location)
                    setAddress(...address)
                  }
                  setImage(downloadURL)
                  updateDoc(doc(db, 'users', user?.uid), {
                    photoURL: downloadURL,
                    photoLink: link
                  }).finally(() => {
                    getUserProfile(user)
                    setUploadLoading(false)
                  })
                })
            }
          )
        }
      }
    }
  }

  const updateUserProfile = () => {
    setUpdateLoading(true)
    if (userProfile)
      updateDoc(doc(db, 'users', user?.uid), {
        id: user?.uid,
        displayName: user?.displayName,
        job,
        company,
        username,
        school,
        city,
        about,
        age: moment().diff(moment(date, 'DD-MM-YYYY'), 'years'),
        ageDate: date,
        timestamp: serverTimestamp()
      }).finally(() => {
        setUpdateLoading(false)
        getUserProfile(user)
      })
    else
      setDoc(doc(db, 'users', user?.uid), {
        id: user?.uid,
        displayName: user?.displayName,
        job,
        company,
        username,
        school,
        city,
        about,
        age: moment().diff(moment(date, 'DD-MM-YYYY'), 'years'),
        ageDate: date,
        timestamp: serverTimestamp()
      }).finally(() => {
        setUpdateLoading(false)
        getUserProfile(user)
      })
  }

  const maleGender = () => {
    if (userProfile)
      updateDoc(doc(db, 'users', user?.uid), {
        gender: 'male'
      }).finally(() => {
        setChecked('male')
        getUserProfile(user)
      })
    else
      setDoc(doc(db, 'users', user?.uid), {
        gender: 'male'
      }).finally(() => {
        setChecked('male')
        getUserProfile(user)
      })
  }

  const femaleGender = () => {
    if (userProfile)
      updateDoc(doc(db, 'users', user?.uid), {
        gender: 'female'
      }).finally(() => {
        setChecked('female')
        getUserProfile(user)
      })
    else
      setDoc(doc(db, 'users', user?.uid), {
        gender: 'female'
      }).finally(() => {
        setChecked('female')
        getUserProfile(user)
      })
  }

  const getLocation = async () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
      )
      return
    }
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied")
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    const address = await Location.reverseGeocodeAsync(location.coords)
    setLocation(location)
    setAddress(...address)

    await updateDoc(doc(db, 'users', user?.uid), {
      address,
      location
    })
  }

  console.log('address: ', address)

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showTitle showAratar showBack title={`Welcome, ${user.displayName}`} />

      <ScrollView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            padding: 10,
            position: 'relative'
          }}
        >
          <Image
            style={{
              width: '100%',
              height: 400,
              borderRadius: 12
            }}
            source={{ uri: image ? image : userProfile?.photoURL || user.photoURL }}
          />
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              bottom: -10,
              right: 20,
              height: 50,
              zIndex: 1
            }}
          >
            <TouchableOpacity
              onPress={logout}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.blue,
                borderRadius: 50,
                marginRight: 10
              }}
            >
              <MaterialCommunityIcons name='cog' size={28} color={color.white} />
            </TouchableOpacity>
            {
              userProfile?.displayName &&
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: color.blue,
                  borderRadius: 50
                }}
              >
                {
                  uploadLoading ?
                    <ActivityIndicator size='large' color={color.white} /> :
                    <MaterialCommunityIcons name='pencil' size={28} color={color.white} />
                }
              </TouchableOpacity>
            }
          </View>
        </View>

        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 10
          }}
        >
          <TextInput
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: color.dark
            }}
          />

          <DatePicker
            style={{
              width: '100%',
            }}
            date={date}
            mode='date'
            placeholder='Age'
            format='DD/MM/YYYY'
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            customStyles={{
              dateIcon: {
                position: 'absolute',
                right: -5,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                borderColor: 'gray',
                alignItems: 'flex-start',
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: color.borderColor,
                height: 45
              },
              placeholderText: {
                fontSize: 14,
                fontFamily: 'text',
                color: color.dark
              },
              dateText: {
                fontSize: 16,
              }
            }}
            onDateChange={setDate}
          />

          <TextInput
            placeholder='Enter your occupation'
            value={job}
            onChangeText={setJob}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: color.dark
            }}
          />

          <TextInput
            placeholder='Where do you work'
            value={company}
            onChangeText={setCompany}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: color.dark
            }}
          />

          <TextInput
            placeholder='School'
            value={school}
            onChangeText={setSchool}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: color.dark
            }}
          />

          <TextInput
            placeholder='I live in (City)'
            value={city}
            onChangeText={setCity}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: color.dark
            }}
          />

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              minHeight: 45,
              marginTop: 20
            }}
          >
            <Text
              style={{
                color: color.dark,
                fontFamily: 'text'
              }}
            >
              Gender
            </Text>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="male"
                  color={color.blue}
                  status={checked === "male" ? "checked" : "unchecked"}
                  onPress={maleGender}
                />
                <Text
                  style={{
                    fontFamily: "text"
                  }}
                >
                  Male
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="female"
                  color={color.blue}
                  status={checked === "female" ? "checked" : "unchecked"}
                  onPress={femaleGender}
                />
                <Text
                  style={{
                    fontFamily: "text"
                  }}
                >
                  Female
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              minHeight: 45,
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: 'text'
                }}
              >
                {address?.subregion}, {address?.country}
              </Text>
            </View>
            <TouchableOpacity
              onPress={getLocation}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 10,
                backgroundColor: color.blue,
                borderRadius: 12,
                marginBottom: 10
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.white
                }}
              >
                Get Location
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            multiline
            placeholder='About me'
            value={about}
            onChangeText={setAbout}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              height,
              minHeight: 45,
              maxHeight: 100,
              fontFamily: 'text',
              marginTop: 20,
              color: color.dark
            }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Passion')}
            style={{
              minHeight: 45,
              marginTop: 20
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                color: color.dark
              }}
            >
              Passions
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              {
                passions.map((passion, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderWidth: 2,
                        borderRadius: 50,
                        borderColor: color.borderColor,
                        marginBottom: 10,
                        marginRight: 10
                      }}
                    >
                      <Text
                        style={{
                          color: color.lightText,
                          fontSize: 12,
                          fontFamily: "text",
                          textTransform: "capitalize"
                        }}
                      >
                        {passion}
                      </Text>
                    </View>
                  )
                })
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={updateUserProfile}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 20,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.blue,
              marginTop: 30,
              marginBottom: 50
            }}
          >
            {
              updateLoading ?
                <ActivityIndicator size='small' color={color.white} /> :
                <Text
                  style={{
                    fontFamily: 'text',
                    color: color.white
                  }}
                >
                  Update Profile
                </Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default EditProfile