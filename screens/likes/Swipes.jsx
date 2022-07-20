import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native'

import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

import { useFonts } from 'expo-font'
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { useNavigation } from '@react-navigation/native'

import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons'

import Swiper from 'react-native-deck-swiper'

import { LinearGradient } from 'expo-linear-gradient'

import AutoHeightImage from 'react-native-auto-height-image'

const { width, height } = Dimensions.get('window')

const Swipes = () => {
  const { pendingSwipes, user, profiles, userProfile } = useAuth()
  const navigation = useNavigation()
  const swipeRef = useRef(null)

  const [swipes, setSwipes] = useState([])

  useEffect(() =>
    (() => {
      onSnapshot(query(collection(db, 'users', user?.uid, 'swipes'), orderBy('timestamp', 'desc')),
        snapshot => {
          setSwipes(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              ...doc?.data()
            }))
          )
        })
    })()
    , [])

  const undoSwipe = async swipe => {
    await deleteDoc(doc(db, "users", user?.uid, 'swipes', swipe?.id))
    await deleteDoc(doc(db, "users", swipe?.id, 'pendingSwipes', user?.uid))
  }

  const disabled = () => {
    console.log('not logged in')
  }

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
        !swipes?.length ?
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
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
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
                swipes?.map((swipe, index) => {
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
                        source={{ uri: swipe?.photoURL }}
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
                          justifyContent: 'flex-end',
                          marginBottom: 10
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => userProfile ? undoSwipe(swipe) : disabled()}
                          style={{
                            backgroundColor: color.red,
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 10
                          }}
                        >
                          <Feather name='x' size={24} color={color.white} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </ScrollView>
      }
    </SafeAreaView>
  )
}

export default Swipes