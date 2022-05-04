import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { View, Text, Button, SafeAreaView, Image, ActivityIndicator } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'

import Bar from '../components/StatusBar'
import color from '../style/color'

import Header from '../components/Header'

import Swiper from 'react-native-deck-swiper'
import { collection, doc, getDocs, getDoc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { LinearGradient } from "expo-linear-gradient"

import generateId from "../lib/generateId"

const Home = () => {
  const navigation = useNavigation()
  const { user, userProfile } = useAuth()

  const swipeRef = useRef(null)

  const [profiles, setProfiles] = useState([])
  const [stackSize, setStackSize] = useState(1)


  useLayoutEffect(() =>
    onSnapshot(doc(db, 'users', user.uid), snapshot => {
      if (!snapshot.exists()) navigation.navigate('UpdateModal')
    })
    , [])

  useEffect(() => {
    let unsub

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, 'users', user.uid, 'passes'))
        .then(snapshot => snapshot.docs.map(doc => doc.id))

      const passeedUserIds = (await passes).length > 0 ? passes : ['test']

      const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes'))
        .then(snapshot => snapshot.docs.map(doc => doc.id))

      const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

      unsub =
        onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
          snapshot => {
            setProfiles(
              snapshot.docs.filter(doc => doc.id !== user.uid)
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

    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped)
  }

  const swipeRight = async (cardIndex) => {
    setStackSize(stackSize + 1)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]


    const loggedInProfile = await (await getDoc(doc(db, 'users', user.uid))).data()

    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid))
      .then(documentSnapshot => {
        if (documentSnapshot.exists()) {
          console.log(`Hooray, you matched with ${userSwiped.displayName}`)

          setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp()
          })

          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped
          })
        } else {
          console.log(`You swiped on ${userSwiped.displayName} (${userSwiped.job})`)

          setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped)
        }
      })

    setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped)
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: color.white,
        flex: 1
      }}
    >
      <Bar />
      <Header showLogo showAratar />

      <View style={{ flex: 1, marginTop: -5 }}>
        {
          profiles?.length >= 1 ?
            <Swiper
              cards={profiles}
              containerStyle={{
                backgroundColor: color.transparent,
                marginTop: -28
              }}
              cardIndex={0}
              stackSize={stackSize}
              verticalSwipe={true}
              animateCardOpacity={true}
              backgroundColor={color.transparent}
              cardHorizontalMargin={2}
              onSwipedLeft={cardIndex => swipeLeft(cardIndex)}
              onSwipedRight={cardIndex => swipeRight(cardIndex)}
              onSwipedBottom={cardIndex => swipeLeft(cardIndex)}
              overlayLabels={{
                left: {
                  title: "NOPE",
                  style: {
                    label: {
                      textAlign: "right",
                      color: color.red,
                      fontFamily: "text"
                    }
                  }
                },

                bottom: {
                  title: "NOPE",
                  style: {
                    label: {
                      textAlign: "right",
                      color: color.red,
                      fontFamily: "text"
                    }
                  }
                },

                right: {
                  title: "MATCH",
                  style: {
                    label: {
                      textAlign: "left",
                      color: color.lightGreen,
                      fontFamily: "text"
                    }
                  }
                }
              }}

              renderCard={card => (
                <View
                  key={card.id}
                  style={{
                    backgroundColor: color.white,
                    height: 698,
                    marginTop: -30,
                    width: "100%",
                    borderRadius: 10,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <Image
                    style={{
                      flex: 1,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                    source={{ uri: card?.photoURL }}
                  />

                  <LinearGradient
                    colors={["transparent", color.dark]}
                    style={{
                      width: "100%",
                      minHeight: 60,
                      position: "absolute",
                      bottom: 0,
                      paddingHorizontal: 20,
                      paddingVertical: 10
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          color: color.white,
                          marginBottom: 10,
                          fontFamily: "text",
                          textTransform: "capitalize"
                        }}>
                        {card?.displayName}
                      </Text>
                      {
                        card?.hideAge == true ? null : (
                          <Text
                            style={{
                              fontSize: 20,
                              color: color.white,
                              marginBottom: 10,
                              fontFamily: "text"
                            }}>
                            {", " + card?.age}
                          </Text>
                        )
                      }
                    </View>
                    <View>
                      <Text
                        style={{
                          color: color.white,
                          fontFamily: "text"
                        }}
                      >
                        {card?.job}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              )}
            />
            :
            (
              <View
                style={{
                  flex: 1,
                  backgroundColor: color.white,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    source={require('../assets/rader.gif')}
                    style={{
                      position: 'absolute'
                    }}
                  />
                  <Image
                    source={{ uri: userProfile?.photoURL }}
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
                    color: color.lightText,
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

export default Home