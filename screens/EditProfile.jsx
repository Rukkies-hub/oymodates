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

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'

import { RadioButton } from 'react-native-paper'

import { SimpleLineIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

import Bar from '../components/StatusBar'

import uuid from 'uuid-random'

const EditProfile = () => {
  const {
    user,
    logout,
    userProfile,
    job,
    setJob,
    image,
    setImage,
    username,
    setUsername,
    displayName,
    setDisplayName,
    school,
    setSchool,
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result?.cancelled) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', result?.uri, true)
        xhr.send(null)
      })

      const photoRef = ref(storage, `avatars/${user?.uid}/${uuid()}`)

      const uploadTask = uploadBytesResumable(photoRef, blob)

      if (result?.uri) {
        if (userProfile?.photoURL) {
          setUploadLoading(true)
          const desertRef = ref(storage, userProfile?.photoLink)

          deleteObject(desertRef)
            .then(() => {
              uploadBytes(photoRef, blob)
                .then(snapshot => {
                  getDownloadURL(snapshot.ref)
                    .then(downloadURL => {
                      setImage(downloadURL)
                      updateDoc(doc(db, 'users', user?.uid), {
                        photoURL: downloadURL,
                        photoLink: snapshot.ref._location.path
                      }).then(() => setUploadLoading(false))
                    })
                })
            }).catch(() => setUploadLoading(false))
        } else {
          setUploadLoading(true)
          uploadBytes(photoRef, blob)
            .then(snapshot => {
              getDownloadURL(snapshot.ref)
                .then(downloadURL => {
                  setImage(downloadURL)
                  updateDoc(doc(db, 'users', user?.uid), {
                    photoURL: downloadURL,
                    photoLink: snapshot.ref._location.path
                  }).then(() => setUploadLoading(false))
                })
            })
        }
      }
    }
  }

  const updateUserProfile = () => {
    setUpdateLoading(true)
    if (userProfile)
      updateDoc(doc(db, 'users', user?.uid), {
        id: user?.uid,
        displayName: user?.displayName ? user?.displayName : displayName,
        job,
        company,
        username,
        school,
        city,
        about
      }).then(() => setUpdateLoading(false))
        .catch(() => setUpdateLoading(false))

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
        gender: '',
        appMode: 'light',
        timestamp: serverTimestamp()
      }).then(() => setUpdateLoading(false))
        .catch(() => setUpdateLoading(false))
  }

  const maleGender = () => {
    if (userProfile)
      updateDoc(doc(db, 'users', user?.uid), {
        gender: 'male'
      }).finally(() => {
        setChecked('male')
      })
    else
      setDoc(doc(db, 'users', user?.uid), {
        gender: 'male'
      }).finally(() => {
        setChecked('male')
      })
  }

  const femaleGender = () => {
    if (userProfile)
      updateDoc(doc(db, 'users', user?.uid), {
        gender: 'female'
      }).finally(() => {
        setChecked('female')
      })
    else
      setDoc(doc(db, 'users', user?.uid), {
        gender: 'female'
      }).finally(() => {
        setChecked('female')
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

    await updateDoc(doc(db, 'users', user?.uid), {
      address,
      location
    })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'dark' ? color.black : color.white
      }}
    >
      <Bar color='dark' />
      <Header showTitle showAratar showBack title='Edit Profile' />

      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 20
          }}
        >
          {
            userProfile?.photoURL || user?.photoURL ?
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100
                }}
                source={{ uri: image ? image : userProfile?.photoURL || user?.photoURL }}
              /> :
              <View
                style={{
                  width: '100%',
                  height: 400,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: userProfile?.appMode == 'dark' ? color.black : color.offWhite,
                  borderRadius: 20
                }}
              >
                <SimpleLineIcons name="user" size={60} color={userProfile?.appMode == 'dark' ? color.white : color.lightText} />
              </View>
          }

          <View
            style={{
              flex: 1,
              paddingLeft: 20,
              justifyContent: 'center'
            }}
          >
            {
              userProfile?.username &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    color: userProfile?.appMode == 'dark' ? color.white : color.dark,
                    fontFamily: 'boldText',
                    fontSize: 20
                  }}
                >
                  @{userProfile?.username}
                </Text>
              </View>
            }
            <Text
              style={{
                fontFamily: 'text',
                fontSize: !userProfile?.username ? 18 : null,
                color: userProfile?.appMode == 'dark' ? color.white : color.dark
              }}
            >
              {userProfile?.displayName ? userProfile?.displayName : user?.displayName}
            </Text>
          </View>

          {
            userProfile &&
            <TouchableOpacity
              onPress={() => navigation.navigate('AccountSettings')}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
                borderRadius: 12,
                marginRight: 10
              }}
            >
              <AntDesign name='setting' size={20} color={userProfile?.appMode == 'dark' ? color.white : color.dark} />
            </TouchableOpacity>
          }

          {
            userProfile?.displayName &&
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
                borderRadius: 12,
                marginLeft: 10
              }}
            >
              {
                uploadLoading ?
                  <ActivityIndicator size='large' color={userProfile?.appMode == 'dark' ? color.white : color.dark} /> :
                  <AntDesign name='picture' size={24} color={userProfile?.appMode == 'dark' ? color.white : color.dark} />
              }
            </TouchableOpacity>
          }
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
            placeholderTextColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
            onChangeText={setUsername}
            style={{
              backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.appMode == 'dark' ? color.white : color.dark
            }}
          />

          {
            !user?.displayName &&
            <TextInput
              value={displayName}
              placeholder='Display name'
              placeholderTextColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
              onChangeText={setDisplayName}
              style={{
                backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
                paddingHorizontal: 10,
                borderRadius: 12,
                height: 45,
                fontFamily: 'text',
                marginBottom: 20,
                color: userProfile?.appMode == 'dark' ? color.white : color.dark
              }}
            />
          }

          <TextInput
            value={job}
            onChangeText={setJob}
            placeholder='Enter your occupation'
            placeholderTextColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.appMode == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={company}
            onChangeText={setCompany}
            placeholder='Where do you work'
            placeholderTextColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.appMode == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={school}
            onChangeText={setSchool}
            placeholder='School'
            placeholderTextColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.appMode == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder='I live in (City)'
            placeholderTextColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.appMode == 'dark' ? color.white : color.dark
            }}
          />

          {
            userProfile &&
            <View
              style={{
                minHeight: 45,
                marginTop: 20
              }}
            >
              <Text
                style={{
                  color: userProfile?.appMode == 'dark' ? color.white : color.dark,
                  fontFamily: 'text'
                }}
              >
                Gender
              </Text>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <RadioButton
                    value='male'
                    color={color.red}
                    status={checked === 'male' ? 'checked' : 'unchecked'}
                    uncheckedColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
                    onPress={maleGender}
                  />
                  <Text
                    style={{
                      fontFamily: 'text',
                      color: userProfile?.appMode == 'dark' ? color.white : color.dark
                    }}
                  >
                    Male
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <RadioButton
                    value='female'
                    color={color.red}
                    uncheckedColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
                    status={checked === 'female' ? 'checked' : 'unchecked'}
                    onPress={femaleGender}
                  />
                  <Text
                    style={{
                      fontFamily: 'text',
                      color: userProfile?.appMode == 'dark' ? color.white : color.dark
                    }}
                  >
                    Female
                  </Text>
                </View>
              </View>
            </View>
          }

          <View
            style={{
              minHeight: 45,
              marginTop: 20,
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: 'text',
                  color: userProfile?.appMode == 'dark' ? color.white : color.dark
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
                borderRadius: 12,
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
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            placeholderTextColor={userProfile?.appMode == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.appMode == 'dark' ? color.white : color.dark
            }}
          />

          {
            userProfile &&
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
                  color: userProfile?.appMode == 'dark' ? color.white : color.dark
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
                          borderRadius: 50,
                          marginBottom: 10,
                          marginRight: 10
                        }}
                      >
                        <Text
                          style={{
                            color: userProfile?.appMode == 'dark' ? color.white : color.lightText,
                            fontSize: 12,
                            fontFamily: 'text',
                            textTransform: 'capitalize'
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
          }

          <TouchableOpacity
            onPress={updateUserProfile}
            style={{
              flex: 1,
              marginTop: 30,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.red,
              borderRadius: 12,
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
              backgroundColor: userProfile?.appMode == 'dark' ? color.dark : color.offWhite,
              borderRadius: 12,
              height: 50
            }}
          >
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