import React, { useEffect, useState } from 'react'
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

import Header from '../../components/Header'

import color from '../../style/color'

import useAuth from '../../hooks/useAuth'

import { useFonts } from 'expo-font'

import * as ImagePicker from 'expo-image-picker'

import { useNavigation, useRoute } from '@react-navigation/native'

import { db } from '../../hooks/firebase'

import { serverTimestamp, setDoc, doc, updateDoc } from 'firebase/firestore'

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

import { RadioButton } from 'react-native-paper'

import { SimpleLineIcons, AntDesign } from '@expo/vector-icons'

import Bar from '../../components/StatusBar'

import uuid from 'uuid-random'

import Constants from 'expo-constants'
import AppTheme from './components/AppTheme'
import SnackBar from 'rukkiecodes-expo-snackbar'
import Payment from './components/Payment'
import LookingFor from './components/LookingFor'

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
    theme
  } = useAuth()

  const storage = getStorage()
  const navigation = useNavigation()
  const route = useRoute()

  const [height, setHeight] = useState(50)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (userProfile) {
      setDisabled(false)
    }
    else {
      if (username != '' && displayName != '' && job != '' && company != '' && school != '' && city != '')
        setDisabled(false)
    }
  }, [username, displayName, job, company, school, city])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [9, 16]
    })

    if (!result?.cancelled && result?.type == 'image') {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', result?.uri, true)
        xhr.send(null)
      })

      const link = `avatars/${user?.uid == undefined ? user?.user?.uid : user?.uid}/${uuid()}`

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
                      updateDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid), {
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
                  updateDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid), {
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

  const updateUserProfile = async () => {
    if (userProfile) {
      setUpdateLoading(true)

      try {
        await updateDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid), {
          id: user?.uid == undefined ? user?.user?.uid : user?.uid,
          displayName: user?.displayName ? user?.displayName : displayName,
          job,
          company,
          username,
          school,
          city,
          about
        })
        setUpdateLoading(false)
        setSnackMessage('Profile updated successfully')
        setVisible(true)
      } catch (error) {
        setUpdateLoading(false)
        return
      }
    }
    else {
      setUpdateLoading(true)

      try {
        await setDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid), {
          id: user?.uid == undefined ? user?.user?.uid : user?.uid,
          username,
          displayName: user?.user?.displayName ? user?.user?.displayName : displayName,
          job,
          company,
          school,
          city,
          theme: 'light',
          timestamp: serverTimestamp()
        })
        setUpdateLoading(false)
        setSnackMessage('Profile updated successfully')
        setVisible(true)
      } catch (error) {
        setUpdateLoading(false)
        return
      }
    }
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.transparent
      }}
    >
      <SnackBar
        visible={visible}
        message={snackMessage}
        background={theme == 'dark' ? color.dark : color.white}
        textColor={theme == 'dark' ? color.white : color.dark}
        shadowColor={color.black}
      />

      <Bar color={theme == 'dark' ? 'light' : 'dark'} />

      <Header showBack showTitle showAratar title='Edit Profile' />

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
                  backgroundColor: theme == 'dark' ? color.black : color.offWhite
                }}
              >
                <SimpleLineIcons name='user' size={30} color={theme == 'dark' ? color.white : color.lightText} />
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
                  color: theme == 'dark' ? (userProfile?.username ? color.white : color.offWhite) : (userProfile?.username ? color.dark : color.lightText),
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
                color: theme == 'dark' ? color.white : color.dark
              }}
            >
              {userProfile?.displayName ? userProfile?.displayName : user?.displayName ? user?.displayName : 'Display name'}
            </Text>
          </View>

          {
            userProfile &&
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                borderRadius: 12,
                marginLeft: 10
              }}
            >
              {
                uploadLoading ?
                  <ActivityIndicator size='small' color={theme == 'dark' ? color.white : color.dark} /> :
                  <AntDesign name='picture' size={24} color={theme == 'dark' ? color.white : color.dark} />
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
            placeholderTextColor={theme == 'dark' ? color.white : color.dark}
            onChangeText={setUsername}
            style={{
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: theme == 'dark' ? color.white : color.dark
            }}
          />

          {
            !user?.displayName && !user?.displayName != '' &&
            <TextInput
              value={displayName}
              placeholder='Display name'
              placeholderTextColor={theme == 'dark' ? color.white : color.dark}
              onChangeText={setDisplayName}
              style={{
                backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                paddingHorizontal: 10,
                borderRadius: 12,
                height: 45,
                fontFamily: 'text',
                marginBottom: 20,
                color: theme == 'dark' ? color.white : color.dark
              }}
            />
          }

          <TextInput
            value={job}
            onChangeText={setJob}
            placeholder='Enter your occupation'
            placeholderTextColor={theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: theme == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={company}
            onChangeText={setCompany}
            placeholder='Where do you work'
            placeholderTextColor={theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: theme == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={school}
            onChangeText={setSchool}
            placeholder='School'
            placeholderTextColor={theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              marginBottom: 20,
              color: theme == 'dark' ? color.white : color.dark
            }}
          />

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder='I live in (City)'
            placeholderTextColor={theme == 'dark' ? color.white : color.dark}
            style={{
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
              paddingHorizontal: 10,
              borderRadius: 12,
              height: 45,
              fontFamily: 'text',
              color: theme == 'dark' ? color.white : color.dark
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
                placeholderTextColor={theme == 'dark' ? color.white : color.dark}
                style={{
                  backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  height: 45,
                  fontFamily: 'text',
                  marginBottom: 20,
                  color: theme == 'dark' ? color.white : color.dark
                }}
              />
            </View>
          }

          {
            !userProfile?.gender &&
            <View
              style={{
                minHeight: 45
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('Gender')}
                style={{
                  backgroundColor: color.red,
                  height: 50,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text'
                  }}
                >
                  Set your gender
                </Text>
              </TouchableOpacity>
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
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  backgroundColor: passions?.length < 1 ? (theme == 'dark' ? color.dark : color.offWhite) : color.transparent,
                  borderRadius: 12,
                  height: 45,
                  marginBottom: 20,
                  marginTop: 10
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
                          backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                          borderRadius: 100,
                          marginBottom: 10,
                          marginRight: 10
                        }}
                      >
                        <Text
                          style={{
                            color: theme == 'dark' ? color.white : color.lightText,
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


          {userProfile && <LookingFor />}

          {userProfile && <AppTheme />}

          {/* {userProfile && <Payment />} */}

          <TouchableOpacity
            onPress={updateUserProfile}
            disabled={disabled}
            style={{
              flex: 1,
              marginTop: 30,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: disabled ? (theme == 'dark' ? color.dark : color.labelColor) : color.red,
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
              backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
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
              source={require('../../assets/adaptive-icon.png')}
              style={{
                width: 50,
                height: 50
              }}
            />
            <Text
              style={{
                color: theme == 'dark' ? color.offWhite : color.lightText,
                fontFamily: 'text',
                fontSize: 18,
                marginLeft: 10
              }}
            >
              Version {Constants?.manifest?.version}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default EditProfile
// in use