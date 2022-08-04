import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, SafeAreaView, FlatList, Text } from 'react-native'

import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

import { useFonts } from 'expo-font'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'

import LoadingIndicator from '../../components/LoadingIndicator'
import Avatar from './Avatar'
import Username from './Username'

const Passes = () => {
  const { user, userProfile, theme } = useAuth()
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
    await deleteDoc(doc(db, "users", userProfile?.id, 'passes', pass?.id))

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
        backgroundColor: color.transparent,
        padding: 10
      }}
    >
      {
        !passes?.length ?
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.transparent
            }}
          >
            <LoadingIndicator size={50} theme={theme} />
          </View> :
          <FlatList
            data={passes}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: pass }) => (
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20
                }}
              >
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: pass })}>
                  <Avatar user={pass?.id} />
                </TouchableOpacity>

                <View
                  style={{
                    flex: 1,
                    marginLeft: 10
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: pass })}>
                    <Username user={pass?.id} />
                  </TouchableOpacity>
                  {
                    pass?.about && pass?.about != '' &&
                    <View
                      style={{
                        marginTop: 10
                      }}
                    >
                      <Text
                        numberOfLines={2}
                        style={{
                          fontFamily: 'text',
                          color: theme == 'light' ? color.dark : color.white
                        }}
                      >
                        {pass?.about}
                      </Text>
                    </View>
                  }

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}
                  >
                    <Feather name='home' size={12} color={theme == 'light' ? color.dark : color.white} />

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginLeft: 10
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'text',
                          fontSize: 14,
                          color: theme == 'light' ? color.dark : color.white,
                          marginLeft: 5
                        }}
                      >
                        Lives in
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'boldText',
                          fontSize: 14,
                          color: theme == 'light' ? color.dark : color.white,
                          marginLeft: 5
                        }}
                      >
                        {pass?.city}
                      </Text>
                    </View>
                  </View>

                  {
                    pass?.job != '' &&
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}
                    >
                      <Feather name='briefcase' size={14} color={theme == 'light' ? color.dark : color.white} />

                      <Text
                        style={{
                          fontFamily: 'text',
                          fontSize: 16,
                          color: theme == 'dark' ? color.white : color.dark,
                          marginLeft: 10
                        }}
                      >
                        {pass?.job} {pass?.job ? 'at' : null} {pass?.company}
                      </Text>
                    </View>
                  }

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      marginTop: 10
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => userProfile ? undoPass(pass) : disabled()}
                      style={{
                        backgroundColor: color.red,
                        height: 35,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        paddingHorizontal: 10
                      }}
                    >
                      <Text
                        style={{
                          color: color.white,
                          fontFamily: 'text'
                        }}
                      >
                        Delete pass
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
      }
    </SafeAreaView>
  )
}

export default Passes
// in use