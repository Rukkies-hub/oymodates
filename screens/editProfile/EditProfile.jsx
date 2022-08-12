import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'
import Bar from '../../components/StatusBar'
import Header from '../../components/Header'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import LookingFor from './components/LookingFor'
import AppTheme from './components/AppTheme'
import Constants from 'expo-constants'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import * as ImagePicker from 'expo-image-picker'
import { getStorage } from 'firebase/storage'

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

const EditProfile = () => {
  const {
    user,
    userProfile,
    theme,
    setOverlay,
    logout
  } = useAuth()
  const storage = getStorage()
  const navigation = useNavigation()

  const notificationListener = useRef()
  const responseListener = useRef()

  const [height, setHeight] = useState(50)
  const [disabled, setDisabled] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)

  // INPUTS
  const [displayName, setDisplayName] = useState(user?.displayName || userProfile?.displayName)
  const [username, setUsername] = useState(userProfile?.username)
  const [phone, setPhone] = useState(userProfile?.phone)
  const [job, setJob] = useState(userProfile?.job)
  const [company, setCompany] = useState(userProfile?.company)
  const [school, setSchool] = useState(userProfile?.school)
  const [about, setAbout] = useState(userProfile?.about)
  const [_passions, setPassions] = useState(userProfile?.passions)
  const [city, setCity] = useState(userProfile?.city)


  useEffect(() => {
    const unsub = (() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification)
      })

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { })

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    })()
    return unsub
  }, [])

  useEffect(() => {
    const unsub = (() => {
      if (userProfile) setDisabled(false)
      else
        if (username != '' && phone && displayName != '' && city != '')
          setDisabled(false)
    })()
    return unsub
  }, [username, displayName, job, company, school, city, phone])

  useEffect(() => {
    if (
      username == userProfile?.username &&
      displayName == userProfile?.displayName &&
      phone == userProfile?.phone &&
      job == userProfile?.job &&
      company == userProfile?.company &&
      school == userProfile?.school &&
      city == userProfile?.city &&
      about == userProfile?.about
    ) {
      setDisabled(true)
    }
  }, [username, displayName, phone, job, company, city, school, about])

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss()
    })
  }, [Keyboard])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [9, 16]
    })

    if (!result?.cancelled && result?.type == 'image')
      navigation.navigate('SaveAvatar', { result })
  }

  const setupUser = async () => {
    setUpdateLoading(true)
    setOverlay(true)
    navigation.navigate('Overlay')

    await setDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid), {
      id: user?.uid == undefined ? user?.user?.uid : user?.uid,
      username,
      displayName,
      job,
      company,
      school,
      city,
      phone,
      theme: 'dark',
      timestamp: serverTimestamp()
    })
    schedulePushNotification('Update successful', 'Your profile has been updated successfully')
    setUpdateLoading(false)
    setOverlay(false)
  }

  const updateUserProfile = async () => {
    setUpdateLoading(true)
    setOverlay(true)
    navigation.navigate('Overlay')

    await updateDoc(doc(db, 'users', userProfile?.id), {
      username,
      displayName,
      job,
      company,
      school,
      city,
      about,
      phone
    })
    schedulePushNotification('Update successful', 'Your profile has been updated successfully')
    setUpdateLoading(false)
    setOverlay(false)
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: color.transparent
      }}
    >
      <Bar color={theme == 'dark' ? 'light' : 'dark'} />

      <Header showBack showTitle showAratar title='Edit Profile' />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 20
          }}
        >
          {
            userProfile?.photoURL ?
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100
                }}
                source={{ uri: userProfile?.photoURL }}
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
              <AntDesign name='picture' size={24} color={theme == 'dark' ? color.white : color.dark} />
            </TouchableOpacity>
          }
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={{ flex: 1 }}>
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
              value={phone}
              placeholder='(Country code) Phone'
              autoCapitalize='none'
              autoCorrect={false}
              placeholderTextColor={theme == 'dark' ? color.white : color.dark}
              onChangeText={setPhone}
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
              userProfile &&
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
            }

            {
              userProfile &&
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
            }

            {
              userProfile &&
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
            }

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
              userProfile &&
              <>
                {
                  !userProfile.gender &&
                  <View
                    style={{
                      minHeight: 45,
                      marginTop: 20
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
              </>
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
                    backgroundColor: _passions?.length < 1 ? (theme == 'dark' ? color.dark : color.offWhite) : color.transparent,
                    borderRadius: 12,
                    height: 45,
                    marginBottom: 20,
                    marginTop: 10
                  }}
                >
                  {
                    _passions?.map((passion, index) => (
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
                    ))
                  }
                </View>
              </TouchableOpacity>
            }

            {userProfile && <LookingFor />}

            {userProfile && <AppTheme />}

            <TouchableOpacity
              onPress={() => userProfile ? updateUserProfile() : setupUser()}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

async function schedulePushNotification (title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: require('../../assets/newMessage.mp3')
    },
    trigger: { seconds: 1 },
  })
}

async function registerForPushNotificationsAsync () {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    // console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}

export default EditProfile