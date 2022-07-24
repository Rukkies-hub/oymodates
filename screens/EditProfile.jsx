import React, { useState } from 'react'
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

import Header from '../components/Header'

import color from '../style/color'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'

import * as ImagePicker from 'expo-image-picker'

import { useNavigation, useRoute } from '@react-navigation/native'

import { db } from '../hooks/firebase'

import { serverTimestamp, setDoc, doc, updateDoc } from 'firebase/firestore'

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

import { RadioButton } from 'react-native-paper'

import { SimpleLineIcons, AntDesign } from '@expo/vector-icons'

import Bar from '../components/StatusBar'

import uuid from 'uuid-random'

import Constants from 'expo-constants'
import AppTheme from '../components/AppTheme'
import SnackBar from 'rukkiecodes-expo-snackbar'

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
  } = useAuth()
  const storage = getStorage()
  const navigation = useNavigation()
  const route = useRoute()

  const [height, setHeight] = useState(50)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')

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

      const link = `avatars/${user?.uid}/${uuid()}`

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
                  const progress = (snapshot?.bytesTransferred / snapshot?.totalBytes) * 100
                },
                error => setUploadLoading(false),
                () => {
                  getDownloadURL(uploadTask?.snapshot?.ref)
                    .then(downloadURL => {
                      setImage(downloadURL)
                      updateDoc(doc(db, 'users', user?.uid), {
                        photoURL: downloadURL,
                        photoLink: link
                      }).finally(async () => {
                        setSnackMessage('Display picture set successfully')
                        setVisible(true)
                        setUploadLoading(false)
                      })
                    })
                }
              )
            }).catch(() => setUploadLoading(false))
            .finally(() => setUploadLoading(false))
        } else {
          setUploadLoading(true)
          uploadTask.on('state_changed',
            snapshot => {
              const progress = (snapshot?.bytesTransferred / snapshot?.totalBytes) * 100
            },
            error => setUploadLoading(false),
            () => {
              getDownloadURL(uploadTask?.snapshot?.ref)
                .then(downloadURL => {
                  setImage(downloadURL)
                  updateDoc(doc(db, 'users', user?.uid), {
                    photoURL: downloadURL,
                    photoLink: link
                  }).finally(async () => {
                    setSnackMessage('Display picture set successfully')
                    setVisible(true)
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
        displayName: user?.displayName ? user?.displayName : displayName,
        job,
        company,
        username,
        school,
        city,
        about
      }).then(() => {
        setUpdateLoading(false)
        setSnackMessage('Profile updated successfully')
        setVisible(true)
      }).catch(() => setUpdateLoading(false))

    else
      setDoc(doc(db, 'users', user?.uid), {
        id: user?.uid,
        displayName: user?.displayName ? user?.displayName : displayName,
        job,
        company,
        username,
        school,
        city,
        about,
        gender: '',
        theme: 'light',
        timestamp: serverTimestamp()
      }).then(() => {
        setUpdateLoading(false)
        setUpdateLoading(false)
        setSnackMessage('Profile updated successfully')
      }).catch(() => setUpdateLoading(false))
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

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      <SnackBar
        visible={visible}
        message={snackMessage}
        background={userProfile?.theme == 'dark' ? color.dark : color.white}
        textColor={userProfile?.theme == 'dark' ? color.white : color.dark}
        shadowColor={color.black}
      />

      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />
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
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: userProfile?.theme == 'dark' ? color.black : color.offWhite
                }}
              >
                <SimpleLineIcons name='user' size={30} color={userProfile?.theme == 'dark' ? color.white : color.lightText} />
              </View>
          }

          <View
            style={{
              flex: 1,
              paddingLeft: 20,
              justifyContent: 'center'
            }}
          >

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: userProfile?.theme == 'dark' ? (userProfile?.username ? color.white : color.offWhite) : (userProfile?.username ? color.dark : color.lightText),
                  fontFamily: 'boldText',
                  fontSize: 20
                }}
              >
                {userProfile?.username ? userProfile?.username : 'username'}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: 'text',
                fontSize: !userProfile?.username ? 18 : null,
                color: userProfile?.theme == 'dark' ? color.white : color.dark
              }}
            >
              {userProfile?.displayName ? userProfile?.displayName : user?.displayName ? user?.displayName : 'John Doe'}
            </Text>
          </View>

          {
            userProfile?.displayName && userProfile?.displayName != '' &&
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                borderRadius: 12,
                marginLeft: 10
              }}
            >
              {
                uploadLoading ?
                  <ActivityIndicator size='small' color={userProfile?.theme == 'dark' ? color.white : color.dark} /> :
                  <AntDesign name='picture' size={24} color={userProfile?.theme == 'dark' ? color.white : color.dark} />
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
            autoCapitalize='none'
            textContentType='username'
            autoCorrect={false}
            placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.dark}
            onChangeText={setUsername}
            style={{
              backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.theme == 'dark' ? color.white : color.dark
            }}
          />

          {
            !user?.displayName &&
            <TextInput
              value={displayName}
              placeholder='Display name'
              placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.dark}
              onChangeText={setDisplayName}
              style={{
                backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                paddingHorizontal: 10,
                borderRadius: 12,
                height: 45,
                fontFamily: 'text',
                marginBottom: 20,
                color: userProfile?.theme == 'dark' ? color.white : color.dark
              }}
            />
          }

          <TextInput
            value={job}
            onChangeText={setJob}
            placeholder='Enter your occupation'
            placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.theme == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={company}
            onChangeText={setCompany}
            placeholder='Where do you work'
            placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.theme == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={school}
            onChangeText={setSchool}
            placeholder='School'
            placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: userProfile?.theme == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder='I live in (City)'
            placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              color: userProfile?.theme == 'dark' ? color.white : color.dark
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
                  color: color.red,
                  fontFamily: 'boldText',
                  marginBottom: 10
                }}
              >
                About me
              </Text>
              <TextInput
                multiline
                value={about}
                onChangeText={setAbout}
                placeholder='About me'
                onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.dark}
                style={{
                  backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  height: 45,
                  fontFamily: 'text',
                  marginBottom: 20,
                  color: userProfile?.theme == 'dark' ? color.white : color.dark
                }}
              />
            </View>
          }

          {
            userProfile &&
            <View
              style={{
                minHeight: 45
              }}
            >
              <Text
                style={{
                  color: color.red,
                  fontFamily: 'boldText'
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
                    uncheckedColor={userProfile?.theme == 'dark' ? color.white : color.dark}
                    onPress={maleGender}
                  />
                  <Text
                    style={{
                      fontFamily: 'text',
                      color: userProfile?.theme == 'dark' ? color.white : color.dark
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
                    uncheckedColor={userProfile?.theme == 'dark' ? color.white : color.dark}
                    status={checked === 'female' ? 'checked' : 'unchecked'}
                    onPress={femaleGender}
                  />
                  <Text
                    style={{
                      fontFamily: 'text',
                      color: userProfile?.theme == 'dark' ? color.white : color.dark
                    }}
                  >
                    Female
                  </Text>
                </View>
              </View>
            </View>
          }

          {
            userProfile &&
            <TouchableOpacity
              onPress={() => navigation.navigate('Passion')}
              style={{
                minHeight: 45,
                marginTop: 10
              }}
            >
              <Text
                style={{
                  fontFamily: 'boldText',
                  color: color.red
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
                  passions?.map((passion, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                          borderRadius: 100,
                          marginBottom: 10,
                          marginRight: 10
                        }}
                      >
                        <Text
                          style={{
                            color: userProfile?.theme == 'dark' ? color.white : color.lightText,
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

          {
            userProfile &&
            <AppTheme />
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
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 50
            }}
          >
            <Image
              source={require('../assets/icon.png')}
              style={{
                width: 50,
                height: 50
              }}
            />
            <Text
              style={{
                color: userProfile?.theme == 'dark' ? color.offWhite : color.lightText,
                fontFamily: 'text',
                fontSize: 18,
                marginLeft: 10
              }}
            >
              Version {Constants.manifest.version}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default EditProfile