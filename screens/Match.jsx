import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'

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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Match = () => {
  const navigation = useNavigation()
  const { user, userProfile, profiles, setProfiles } = useAuth()

  const swipeRef = useRef(null)

  const [stackSize, setStackSize] = useState(2)


  useLayoutEffect(() =>
    onSnapshot(doc(db, 'users', user?.uid), snapshot => {
      if (!snapshot.exists()) navigation.navigate('EditProfile')
    })
    , [])

  useEffect(() => {
    let unsub

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, 'users', user?.uid, 'passes'))
        .then(snapshot => snapshot.docs.map(doc => doc.id))

      const passeedUserIds = (await passes).length > 0 ? passes : ['test']

      const swipes = await getDocs(collection(db, 'users', user?.uid, 'swipes'))
        .then(snapshot => snapshot.docs.map(doc => doc.id))

      const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

      unsub =
        onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
          snapshot => {
            setProfiles(
              snapshot.docs.filter(doc => doc.id !== user?.uid)
                .map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }))
            )
          })
    }

    fetchCards()
    return unsub
  }, [db])

  const swipeLeft = async (cardIndex) => {
    setStackSize(stackSize + 1)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    setDoc(doc(db, 'users', user?.uid, 'passes', userSwiped.id), userSwiped)
  }

  const swipeRight = async (cardIndex) => {
    setStackSize(stackSize + 1)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    const loggedInProfile = await (await getDoc(doc(db, 'users', user?.uid))).data()

    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user?.uid))
      .then(documentSnapshot => {
        if (documentSnapshot.exists()) {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user?.uid, userSwiped.id)), {
            users: {
              [user?.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user?.uid, userSwiped.id],
            timestamp: serverTimestamp()
          }).finally(async () => await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile,
            userSwiped
          })
        } else {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped.id), userSwiped)
        }
      })

    setDoc(doc(db, 'users', userSwiped.id, 'pendingSwipes', user?.uid), userProfile)
    setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped.id), userSwiped)
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    lightText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
        flex: 1
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
              cardHorizontalMargin={1}
              cardVerticalMargin={0}
              onSwipedLeft={cardIndex => swipeLeft(cardIndex)}
              onSwipedRight={cardIndex => swipeRight(cardIndex)}
              onSwipedBottom={cardIndex => swipeLeft(cardIndex)}
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
                  key={card.id}
                  style={{
                    backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black,
                    height: 698,
                    marginTop: -30,
                    width: '100%',
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
                      <View
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
                      </View>

                      <TouchableOpacity
                        onPress={() => navigation.navigate('UserProfile', { user: card })}
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
                      card?.job ?
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
                        </View> :
                        null
                    }
                    {
                      card?.school ?
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
                        </View> :
                        null
                    }
                    {
                      card?.city ?
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
                        </View> :
                        null
                    }
                    {
                      card?.about.length >= 20 ?
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
                        </Text> : null
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
            :
            (
              <View
                style={{
                  flex: 1,
                  backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {
                    userProfile?.theme == 'light' &&
                    <Image
                      source={require('../assets/rader.gif')}
                      style={{
                        position: 'absolute'
                      }}
                    />
                  }
                  <Image
                    source={{ uri: userProfile?.photoURL || user?.photoURL }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 100
                    }}
                  />
                </View>

                <Text
                  style={{
                    fontFamily: 'text',
                    color: userProfile?.theme == 'light' ? color.lightText : color.white,
                    marginTop: 50
                  }}
                >
                  There's is no one new around you
                </Text>
              </View>
            )
        }
      </View>
    </SafeAreaView>
  )
}

export default Match