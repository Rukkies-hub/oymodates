import React from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'

import useAuth from '../hooks/useAuth'

import color from '../style/color'

import AutoHeightImage from 'react-native-auto-height-image'

import { useFonts } from 'expo-font'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import generateId from '../lib/generateId'
import { useNavigation } from '@react-navigation/native'

const Likes = () => {
  const { pendingSwipes, user, profiles, setProfiles, userProfile } = useAuth()
  const navigation = useNavigation()

  const window = Dimensions.get('window')

  const swipeLeft = async like => {
    setDoc(doc(db, 'users', user.uid, 'passes', like.id), like)
    await deleteDoc(doc(db, 'users', user.uid, 'pendingSwipes', like.id))
  }

  const swipeRight = async like => {
    const needle = like.id
    const cardIndex = profiles.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', user.uid, 'pendingSwipes', userSwiped.id))
      .then(documentSnapshot => {
        if (documentSnapshot.exists()) {
          console.log(`Hooray, you matched with ${userSwiped.displayName}`)

          setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: userProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp()
          }).finally(async () => await deleteDoc(doc(db, 'users', user.uid, 'pendingSwipes', userSwiped.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: userProfile,
            userSwiped
          })
        }
      })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 20,
          paddingHorizontal: 10
        }}
      >
        <Text
          style={{
            color: color.lightText,
            fontFamily: 'text',
            fontSize: 16,
            textAlign: 'center'
          }}
        >
          Upgrade to Gold to see people who already liked you.
        </Text>
      </View>

      <ScrollView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}
        >
          {
            pendingSwipes.map((like, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: (window.width / 2) - 18,
                    position: 'relative',
                    borderRadius: 20,
                    overflow: 'hidden',
                    borderWidth: 4,
                    borderColor: color.goldDark
                  }}
                >
                  <AutoHeightImage
                    resizeMode='cover'
                    blurRadius={userProfile?.plan != 'gold' ? 50 : userProfile?.plan != 'platinum' ? 50 : 0}
                    source={{ uri: like.photoURL }}
                    width={(window.width / 2) - 10}
                  />

                  {
                    userProfile?.plan == 'gold' ? (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          marginBottom: 10
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => swipeLeft(like)}
                          style={{
                            backgroundColor: color.white,
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Image
                            source={require('../assets/cancel.png')}
                            style={{
                              width: 20,
                              height: 20
                            }}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => swipeRight(like)}
                          style={{
                            backgroundColor: color.white,
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Image
                            source={require('../assets/heart-match.png')}
                            style={{
                              width: 30,
                              height: 30
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : userProfile?.plan == 'planinum' ?
                      (
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginBottom: 10
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => swipeLeft(like)}
                            style={{
                              backgroundColor: color.white,
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Image
                              source={require('../assets/cancel.png')}
                              style={{
                                width: 20,
                                height: 20
                              }}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => swipeRight(like)}
                            style={{
                              backgroundColor: color.white,
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Image
                              source={require('../assets/heart-match.png')}
                              style={{
                                width: 30,
                                height: 30
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null
                  }

                  {
                    userProfile?.plan != 'gold' ? (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          margin: 20,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 50,
                            backgroundColor: color.goldDark,
                            marginRight: 10
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: 'text',
                            color: color.white
                          }}
                        >
                          New
                        </Text>
                      </View>
                    ) :
                      userProfile?.plan != 'platinum' ? (
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            margin: 20,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 50,
                              backgroundColor: color.goldDark,
                              marginRight: 10
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: 'text',
                              color: color.white
                            }}
                          >
                            New
                          </Text>
                        </View>
                      ) : false
                  }
                </View>
              )
            })
          }
        </View>
      </ScrollView>

      {
        pendingSwipes?.length > 0 &&
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            backgroundColor: color.goldDark,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%',
            height: 50,
            marginBottom: 30
          }}
        >
          <Text
            style={{
              color: color.white,
              fontFamily: 'text',
              fontSize: 18
            }}
          >
            See who likes you
          </Text>
        </TouchableOpacity>
      }
    </SafeAreaView>
  )
}

export default Likes