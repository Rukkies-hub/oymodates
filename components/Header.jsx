import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

import {
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
  SimpleLineIcons
} from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'

import color from '../style/color'

import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import MessageSettings from './MessageSettings'

const Header = ({
  showAratar,
  showLogo,
  showTitle,
  title,
  showBack,
  showMatchAvatar,
  matchAvatar,
  showPhone,
  showVideo,
  postDetails,
  showAdd,
  matchDetails,
  showNotification,
  showChatMenu,
  backgroundColor,
  iconColor
}) => {
  const navigation = useNavigation()

  const { user, userProfile, madiaString, media, setMedia, notifications, setNotificatios } = useAuth()
  const videoCallUser = getMatchedUserInfo(matchDetails?.users, user?.uid)

  const [notificationCount, setNotificationCount] = useState([])

  useLayoutEffect(() => {
    (async () => {
      // const querySnapshot = await getDocs(query(collection(db, 'users', user?.uid, 'notifications'), orderBy('timestamp', 'desc')))

      // setNotificatios(
      //   querySnapshot?.docs?.map(doc => ({
      //     notification: doc?.id,
      //     ...doc?.data(),
      //     id: doc?.id,
      //   }))
      // )
      onSnapshot(query(collection(db, 'users', user?.uid, 'notifications'), orderBy('timestamp', 'desc')),
        snapshot => {
          setNotificatios(
            snapshot?.docs?.map(doc => ({
              notification: doc?.id,
              ...doc?.data(),
              id: doc?.id,
            }))
          )
        })
    })()
  }, [])

  useEffect(() => {
    (async () => {
      onSnapshot(query(collection(db, 'users', user?.uid, 'notifications'), where('seen', '==', false)),
        snapshot => {
          setNotificationCount(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              notification: doc?.id,
              ...doc?.data()
            }))
          )
        })
    })()
  }, [])

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View>
      <View
        style={{
          backgroundColor: backgroundColor ? backgroundColor : userProfile?.theme == 'dark' ? color.black : color.white,
          height: 50,
          marginTop: 40,
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {
            showBack &&
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              onLongPress={() => navigation.navigate('Match')}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <Entypo name='chevron-left' size={24} color={userProfile?.theme == 'dark' ? color.white : color.black} />
            </TouchableOpacity>
          }
          {
            showLogo &&
            <Text
              style={{
                fontFamily: 'logo',
                fontSize: 30,
                margin: 0,
                marginTop: -10,
                color: userProfile?.theme == 'dark' ? color.white : color.black
              }}
            >
              Oymo
            </Text>
          }

          {
            showMatchAvatar &&
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: getMatchedUserInfo(matchDetails?.users, user?.uid) })}>
              <Image
                source={{ uri: matchAvatar }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  marginRight: 10
                }}
              />
            </TouchableOpacity>
          }

          {
            showTitle &&
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 18,
                textTransform: 'capitalize',
                color: userProfile?.theme == 'dark' ? color.white : color.black
              }}
            >
              {title}
            </Text>
          }
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          {
            showPhone &&
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <Entypo name='phone' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
            </TouchableOpacity>
          }

          {
            showVideo &&
            <TouchableOpacity
              onPress={() => navigation.navigate('VideoCall', { videoCallUser })}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FontAwesome5 name='video' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
            </TouchableOpacity>
          }

          {
            showChatMenu &&
            <MessageSettings matchDetails={matchDetails} iconColor={iconColor} />
          }

          {
            userProfile &&
            <>
              {
                showNotification &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notifications')}
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    marginRight: 10
                  }}
                >
                  <SimpleLineIcons name='bell' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />

                  {
                    notificationCount?.length > 0 &&
                    <View
                      style={{
                        borderRadius: 50,
                        backgroundColor: color.red,
                        paddingHorizontal: 5,
                        position: 'absolute',
                        top: 0,
                        right: 0
                      }}
                    >
                      <Text
                        style={{
                          color: color.white,
                          fontSize: 10
                        }}
                      >
                        {notificationCount?.length}
                      </Text>
                    </View>
                  }
                </TouchableOpacity>
              }
            </>
          }

          {
            userProfile &&
            <>
              {
                showAdd &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddReels')}
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FontAwesome name='plus-square-o' color={userProfile?.theme == 'dark' ? color.white : color.black} size={26} />
                </TouchableOpacity>
              }
            </>
          }

          {
            showAratar &&
            <>
              {
                !userProfile &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile')}
                  style={{
                    minWidth: 40,
                    minHeight: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10
                  }}
                >
                  <SimpleLineIcons name='user' size={20} color={userProfile?.theme == 'dark' ? color.white : color.dark} />
                </TouchableOpacity>
              }
              {
                userProfile &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={{
                    minWidth: 35,
                    minHeight: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 15
                  }}
                >
                  <Image
                    source={{ uri: userProfile?.photoURL || user?.photoURL }}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 50
                    }}
                  />
                </TouchableOpacity>
              }
            </>
          }
        </View>
      </View>
    </View >
  )
}

export default Header