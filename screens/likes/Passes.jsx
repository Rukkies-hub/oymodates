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

const Passes = () => {
  const { pendingSwipes, user, profiles, userProfile } = useAuth()
  const navigation = useNavigation()
  const swipeRef = useRef(null)

  

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
          <View>

          </View>
      }
    </SafeAreaView>
  )
}

export default Passes