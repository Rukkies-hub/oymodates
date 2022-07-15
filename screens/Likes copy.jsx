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

import { AntDesign, Feather } from '@expo/vector-icons'

const Likes = () => {
  const { pendingSwipes, user, profiles, setProfiles, userProfile } = useAuth()
  const navigation = useNavigation()

  const { width, height } = Dimensions.get('window')

  const swipeLeft = async like => {
    setDoc(doc(db, 'users', user?.uid, 'passes', like.id), like)
    await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', like.id))
  }

  const swipeRight = async like => {
    const needle = like.id
    const cardIndex = profiles.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped.id))
      .then(documentSnapshot => {
        if (documentSnapshot.exists()) {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user?.uid, userSwiped.id)), {
            users: {
              [user?.uid]: userProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user?.uid, userSwiped.id],
            timestamp: serverTimestamp()
          }).finally(async () => await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped.id)))

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

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      {
        pendingSwipes?.length > 0 ?
          <ScrollView
            style={{
              flex: 1,
              marginTop: 20
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
                        width: (width / 2) - 18,
                        position: 'relative',
                        borderRadius: 20,
                        overflow: 'hidden'
                      }}
                    >
                      <AutoHeightImage
                        resizeMode='cover'
                        source={{ uri: like.photoURL }}
                        width={(width / 2) - 10}
                        style={{
                          maxHeight: 250
                        }}
                      />

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
                          <Feather name='x' size={24} color={color.red} />
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
                          <AntDesign name='heart' size={24} color={color.lightGreen} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </ScrollView> :

          <View
            style={{
              flex: 1,
              backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
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
              No likes at the moment
            </Text>
          </View>
      }
    </SafeAreaView>
  )
}

export default Likes