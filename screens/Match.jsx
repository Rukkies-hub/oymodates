import React, { useState, useRef, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'

import color from '../style/color'

import Swiper from 'react-native-deck-swiper'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  deleteDoc
} from 'firebase/firestore'

import { db } from '../hooks/firebase'

import { LinearGradient } from 'expo-linear-gradient'

import generateId from '../lib/generateId'

import { useFonts } from 'expo-font'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LoadingIndicator from '../components/LoadingIndicator'

const { width, height } = Dimensions.get('window')

const Match = () => {
  const navigation = useNavigation()
  const { user, userProfile, profiles, setProfiles, theme, lookingFor } = useAuth()

  const swipeRef = useRef(null)

  const [stackSize, setStackSize] = useState(2)

  useEffect(() => {
    (async () => {
      const passes = await getDocs(collection(db, 'users', user?.uid, 'passes'))
        .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

      const passeedUserIds = (await passes).length > 0 ? passes : ['test']

      const swipes = await getDocs(collection(db, 'users', user?.uid, 'swipes'))
        .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

      const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

      if (lookingFor != undefined)
        onSnapshot(query(collection(db, 'users'),
          where('id', 'not-in', [...passeedUserIds, ...swipededUserIds]),
          where('gender', '==', lookingFor)
        ),
          snapshot => {
            setProfiles(
              snapshot?.docs?.filter(doc => doc?.data()?.photoURL != null)
                .filter(doc => doc?.id !== user?.uid)
                .map(doc => ({
                  id: doc?.id,
                  ...doc?.data()
                }))
            )
          })
      else
        onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
          snapshot => {
            setProfiles(
              snapshot?.docs?.filter(doc => doc?.data()?.photoURL != null)
                .filter(doc => doc?.id !== user?.uid)
                .map(doc => ({
                  id: doc?.id,
                  ...doc?.data()
                }))
            )
          })
    })()
  }, [lookingFor, db])

  const swipeLeft = async (cardIndex) => {
    setStackSize(stackSize + 1)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    setDoc(doc(db, 'users', userProfile?.id, 'passes', userSwiped?.id), userSwiped)
  }

  const swipeRight = async cardIndex => {
    setStackSize(stackSize + 1)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', userSwiped?.id, 'swipes', userProfile?.id))
      .then(documentSnapshot => {
        if (documentSnapshot?.exists()) {
          setDoc(doc(db, 'users', userProfile?.id, 'swipes', userSwiped?.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(userProfile?.id, userSwiped?.id)), {
            users: {
              [userProfile?.id]: userProfile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [userProfile?.id, userSwiped?.id],
            timestamp: serverTimestamp()
          }).finally(async () => await deleteDoc(doc(db, 'users', userProfile?.id, 'pendingSwipes', userSwiped?.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: userProfile,
            userSwiped
          })
        } else {
          setDoc(doc(db, 'users', userProfile?.id, 'swipes', userSwiped?.id), userSwiped)
        }
      })

    setDoc(doc(db, 'users', userSwiped?.id, 'pendingSwipes', userProfile?.id), userProfile)
    setDoc(doc(db, 'users', userProfile?.id, 'swipes', userSwiped?.id), userSwiped)
  }

  const disabled = () => navigation.navigate('SetupModal')


  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    lightText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.transparent
      }}
    >
      <View style={{ flex: 1, marginTop: -5 }}>
        {
          profiles?.length >= 1 ?
            <Swiper
              ref={swipeRef}
              cards={profiles}
              containerStyle={{
                backgroundColor: color.transparent,
                marginTop: 33
              }}
              cardIndex={0}
              stackSize={stackSize}
              verticalSwipe={false}
              animateCardOpacity={true}
              backgroundColor={color.transparent}
              cardHorizontalMargin={0}
              cardVerticalMargin={0}
              onSwipedLeft={cardIndex => userProfile ? swipeLeft(cardIndex) : disabled()}
              onSwipedRight={cardIndex => userProfile ? swipeRight(cardIndex) : disabled()}
              overlayLabels={{
                left: {
                  title: 'NOPE',
                  style: {
                    label: {
                      textAlign: 'center',
                      color: color.red,
                      fontFamily: 'text',
                      borderWidth: 4,
                      borderRadius: 20,
                      borderColor: color.red,
                      position: 'absolute',
                      top: 0,
                      right: 20,
                      width: 150
                    }
                  }
                },

                right: {
                  title: 'MATCH',
                  style: {
                    label: {
                      textAlign: 'center',
                      color: color.lightGreen,
                      fontFamily: 'text',
                      borderWidth: 4,
                      borderRadius: 20,
                      borderColor: color.lightGreen,
                      position: 'absolute',
                      top: 0,
                      left: 20,
                      width: 160
                    }
                  }
                }
              }}

              renderCard={card => (
                <View
                  key={card?.id}
                  style={{
                    backgroundColor: color.transparent,
                    width,
                    height: height - 112,
                    marginTop: -25,
                    borderRadius: 12,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Image
                    style={{
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                    source={{ uri: card?.photoURL }}
                  />

                  <LinearGradient
                    colors={['transparent', theme == 'dark' ? color.black : color.dark]}
                    style={{
                      width: '100%',
                      minHeight: 60,
                      position: 'absolute',
                      bottom: 0,
                      padding: 20,
                      marginBottom: -2
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => userProfile ? navigation.navigate('UserProfile', { user: card }) : disabled()}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            color: color.white,
                            marginBottom: 10,
                            fontFamily: 'boldText',
                            textTransform: 'capitalize'
                          }}>
                          {card?.username}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => userProfile ? navigation.navigate('UserProfile', { user: card }) : disabled()}
                        style={{
                          width: 40,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <MaterialCommunityIcons name='information-outline' size={20} color={color.white} />
                      </TouchableOpacity>
                    </View>
                    {
                      card?.job != '' &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <MaterialCommunityIcons name='briefcase-variant-outline' size={17} color={color.white} />
                        <Text
                          style={{
                            fontSize: 18,
                            color: color.white,
                            fontFamily: 'lightText'
                          }}
                        >
                          {` ${card?.job}`} {card?.job ? 'at' : null} {card?.company}
                        </Text>
                      </View>
                    }
                    {
                      card?.school != '' &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginTop: 10
                        }}
                      >
                        <MaterialCommunityIcons name='school-outline' size={17} color={color.white} />
                        <Text
                          style={{
                            fontSize: 18,
                            color: color.white,
                            fontFamily: 'lightText'
                          }}
                        >
                          {` ${card?.school}`}
                        </Text>
                      </View>
                    }

                    {
                      card?.city != '' &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginTop: 10
                        }}
                      >
                        <MaterialCommunityIcons name='home-outline' size={17} color={color.white} />
                        <Text
                          style={{
                            fontSize: 18,
                            color: color.white,
                            fontFamily: 'lightText'
                          }}
                        >
                          {` ${card?.city}`}
                        </Text>
                      </View>
                    }

                    {
                      card?.about?.length >= 20 &&
                      <Text
                        numberOfLines={4}
                        style={{
                          color: color.white,
                          fontSize: 18,
                          fontFamily: 'lightText',
                          marginTop: 10
                        }}
                      >
                        {card?.about}
                      </Text>
                    }

                    {
                      card?.passions?.length > 0 &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginTop: 10
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                          }}
                        >
                          {
                            card?.passions?.map((passion, index) => {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 50,
                                    marginBottom: 10,
                                    marginRight: 10,
                                    backgroundColor: `${color.faintBlack}`
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: color.white,
                                      fontSize: 12,
                                      fontFamily: 'lightText',
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
                      </View>
                    }
                  </LinearGradient>
                </View>
              )}
            /> :
            (
              <View
                style={{
                  flex: 1,
                  backgroundColor: color.transparent,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <LoadingIndicator size={50} theme={theme} />
              </View>
            )
        }
      </View>
    </SafeAreaView>
  )
}

export default Match
// in use