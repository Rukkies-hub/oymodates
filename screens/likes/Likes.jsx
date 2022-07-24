import React, { useRef, useState } from 'react'
import { View, Text, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native'

import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

import { useFonts } from 'expo-font'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { useNavigation } from '@react-navigation/native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import Swiper from 'react-native-deck-swiper'

import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window')

const Likes = () => {
  const { pendingSwipes, user, profiles, userProfile } = useAuth()
  const navigation = useNavigation()
  const swipeRef = useRef(null)

  const [stackSize, setStackSize] = useState(2)


  const swipeLeft = async cardIndex => {
    setStackSize(stackSize + 1)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    setDoc(doc(db, 'users', user?.uid, 'passes', userSwiped?.id), userSwiped)
    await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped?.id))
  }

  const swipeRight = async cardIndex => {
    setStackSize(stackSize + 1)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped?.id))
      .then(documentSnapshot => {
        if (documentSnapshot?.exists()) {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user?.uid, userSwiped?.id)), {
            users: {
              [user?.uid]: userProfile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [user?.uid, userSwiped?.id],
            timestamp: serverTimestamp()
          }).finally(async () => await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped?.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: userProfile,
            userSwiped
          })
        }
      })

    setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)
  }

  const disabled = () => navigation.navigate('SetupModal')

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    lightText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      {
        !pendingSwipes?.length ?
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: userProfile?.photoURL }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100
                  }}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.white,
                    position: 'absolute',
                    top: -13,
                    right: -13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: color.black,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <ActivityIndicator size='small' color={color.red} />
                </View>
              </View>
            </View>
          </View> :
          <View style={{ flex: 1, marginTop: -5 }}>
            {
              pendingSwipes?.length >= 1 &&
              <Swiper
                ref={swipeRef}
                cards={pendingSwipes}
                containerStyle={{
                  backgroundColor: color.transparent,
                  marginTop: 33
                }}
                cardIndex={0}
                stackSize={stackSize}
                verticalSwipe={false}
                animateCardOpacity={true}
                backgroundColor={color.transparent}
                cardHorizontalMargin={1}
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
                      backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
                      width,
                      height: height - 160,
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
                      colors={['transparent', color.dark]}
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
              />
            }
          </View>
      }
    </SafeAreaView>
  )
}

export default Likes