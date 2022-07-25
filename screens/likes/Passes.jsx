import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions, ScrollView } from 'react-native'

import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

import { useFonts } from 'expo-font'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'

import AutoHeightImage from 'react-native-auto-height-image'

const { width } = Dimensions.get('window')

const Passes = () => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()

  const [passes, setPasses] = useState([])

  useEffect(() =>
    (() => {
      onSnapshot(query(collection(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid, 'passes'), orderBy('timestamp', 'desc')),
        snapshot => {
          setPasses(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              ...doc?.data()
            }))
          )
        })
    })()
    , [])

  const undoPass = async pass =>
    await deleteDoc(doc(db, "users", user?.uid == undefined ? user?.user?.uid : user?.uid, 'passes', pass?.id))

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
        !passes?.length ?
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
              <ActivityIndicator size='large' color={color.red} />
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
                passes?.map((pass, index) => {
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
                        source={{ uri: pass?.photoURL }}
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
                          onPress={() => userProfile ? undoPass(pass) : disabled()}
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

export default Passes