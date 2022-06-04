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

import { useFonts } from 'expo-font'

import DatePicker from 'react-native-datepicker'

import * as ImagePicker from 'expo-image-picker'

import moment from 'moment'

import { useNavigation } from '@react-navigation/native'

import { db } from '../hooks/firebase'

import { serverTimestamp, setDoc, doc, updateDoc } from 'firebase/firestore'

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

import { RadioButton } from "react-native-paper"

import { SimpleLineIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

let link = `avatars/${new Date().toISOString()}`

import Bar from '../components/StatusBar'

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
      aspect: [9, 16],
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
                },
                error => {
                  setUploadLoading(false)
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
            })
        }
        else {
          setUploadLoading(true)
          uploadTask.on('state_changed',
            snapshot => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
            error => {
              setUploadLoading(false)
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
        ageDate: date
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
        gender: 'male',
        appMode: 'light',
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

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'light' ? color.white : color.dark
      }}
    >
      <Header showTitle showAratar showBack title={`Welcome, ${user.displayName}`} />

      <ScrollView style={{ flex: 1 }}>
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
              onPress={() => navigation.navigate('AccountSettings')}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.red,
                borderRadius: 50,
                marginRight: 10
              }}
            >
              <AntDesign name="setting" size={24} color={color.white} />
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
                  backgroundColor: color.red,
                  borderRadius: 50
                }}
              >
                {
                  uploadLoading ?
                    <ActivityIndicator size='large' color={color.white} /> :
                    <AntDesign name='picture' size={24} color={color.white} />
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
            value={username}
            placeholder='Username'
            placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
            onChangeText={setUsername}
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.appMode == 'light' ? color.dark : color.white
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
            placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
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
                borderBottomWidth: .3,
                borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
                height: 45
              },
              placeholderText: {
                fontSize: 14,
                fontFamily: 'text',
                color: userProfile?.appMode == 'light' ? color.dark : color.white
              },
              dateText: {
                fontSize: 16,
                color: userProfile?.appMode == 'light' ? color.dark : color.white
              }
            }}
            onDateChange={setDate}
          />

          <TextInput
            value={job}
            onChangeText={setJob}
            placeholder='Enter your occupation'
            placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          />

          <TextInput
            value={company}
            onChangeText={setCompany}
            placeholder='Where do you work'
            placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          />

          <TextInput
            value={school}
            onChangeText={setSchool}
            placeholder='School'
            placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          />

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder='I live in (City)'
            placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20,
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          />

          <View
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
              minHeight: 45,
              marginTop: 20
            }}
          >
            <Text
              style={{
                color: userProfile?.appMode == 'light' ? color.dark : color.white,
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
                  color={color.red}
                  status={checked === "male" ? "checked" : "unchecked"}
                  uncheckedColor={userProfile?.appMode == 'light' ? color.dark : color.white}
                  onPress={maleGender}
                />
                <Text
                  style={{
                    fontFamily: "text",
                    color: userProfile?.appMode == 'light' ? color.dark : color.white
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
                  color={color.red}
                  uncheckedColor={userProfile?.appMode == 'light' ? color.dark : color.white}
                  status={checked === "female" ? "checked" : "unchecked"}
                  onPress={femaleGender}
                />
                <Text
                  style={{
                    fontFamily: "text",
                    color: userProfile?.appMode == 'light' ? color.dark : color.white
                  }}
                >
                  Female
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
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
                  fontFamily: 'text',
                  color: userProfile?.appMode == 'light' ? color.dark : color.white
                }}
              >
                {address?.subregion}{address?.subregion ? ',' : null} {address?.country}
              </Text>
            </View>
            <TouchableOpacity
              onPress={getLocation}
              style={{
                backgroundColor: color.red,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginLeft: 5
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
            value={about}
            onChangeText={setAbout}
            placeholder='About me'
            placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            style={{
              borderBottomWidth: .3,
              borderBottomColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
              height,
              minHeight: 45,
              maxHeight: 100,
              fontFamily: 'text',
              marginTop: 20,
              color: userProfile?.appMode == 'light' ? color.dark : color.white
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
                color: userProfile?.appMode == 'light' ? color.dark : color.white
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
                        borderColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
                        marginBottom: 10,
                        marginRight: 10
                      }}
                    >
                      <Text
                        style={{
                          color: userProfile?.appMode == 'light' ? color.lightText : color.white,
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
              flex: 1,
              marginTop: 30,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.red,
              borderRadius: 4,
              height: 50
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

          <TouchableOpacity
            onPress={logout}
            style={{
              flex: 1,
              marginTop: 30,
              marginBottom: 50,
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : color.lightText,
              borderRadius: 4,
              height: 50
            }}
          >
            <SimpleLineIcons name="logout" size={20} color={color.red} />
            <Text
              style={{
                fontFamily: 'text',
                color: color.red,
                marginLeft: 10
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default EditProfile