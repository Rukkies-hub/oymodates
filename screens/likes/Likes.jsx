import React from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native'

import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

import AutoHeightImage from 'react-native-auto-height-image'

import { useFonts } from 'expo-font'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { useNavigation } from '@react-navigation/native'

import { AntDesign, Feather } from '@expo/vector-icons'

const Likes = () => {
  const { pendingSwipes, user, profiles, setProfiles, userProfile } = useAuth()
  const navigation = useNavigation()

  const { width, height } = Dimensions.get('window')

  const swipeLeft = async like => {
    setDoc(doc(db, 'users', userProfile?.id, 'passes', like.id), like)
    await deleteDoc(doc(db, 'users', userProfile?.id, 'pendingSwipes', like.id))
  }

  const swipeRight = async like => {
    const needle = like.id
    const cardIndex = profiles.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', userProfile?.id, 'pendingSwipes', userSwiped.id))
      .then(documentSnapshot => {
        if (documentSnapshot.exists()) {
          setDoc(doc(db, 'users', userProfile?.id, 'swipes', userSwiped.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(userProfile?.id, userSwiped.id)), {
            users: {
              [userProfile?.id]: userProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [userProfile?.id, userSwiped.id],
            timestamp: serverTimestamp()
          }).finally(async () => await deleteDoc(doc(db, 'users', userProfile?.id, 'pendingSwipes', userSwiped.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: userProfile,
            userSwiped
          })
        }
      })

    setDoc(doc(db, 'users', userProfile?.id, 'swipes', userSwiped?.id), userSwiped)
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.transparent
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

                      <TouchableOpacity
                        onPress={() => navigation.navigate('UserProfile', { user: like })}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%'
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
                          marginBottom: 10,
                          zIndex: 10
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
              backgroundColor: color.transparent,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ActivityIndicator size='large' color={color.red} />
          </View>
      }
    </SafeAreaView>
  )
}

export default Likes