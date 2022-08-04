import React from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'

import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

import { useFonts } from 'expo-font'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'

import LoadingIndicator from '../../components/LoadingIndicator'
import Avatar from './Avatar'
import Username from './Username'

const Likes = () => {
  const { pendingSwipes, profiles, theme, userProfile } = useAuth()
  const navigation = useNavigation()

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
          }).then(async () => await deleteDoc(doc(db, 'users', userProfile?.id, 'pendingSwipes', userSwiped.id)))

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
    <View
      style={{
        flex: 1,
        backgroundColor: color.transparent,
        padding: 10
      }}
    >
      {
        pendingSwipes?.length > 0 ?
          <FlatList
            data={pendingSwipes}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: like }) => (
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20
                }}
              >
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: like })}>
                  <Avatar user={like?.id} />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 10
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: like })}>
                    <Username user={like?.id} />
                  </TouchableOpacity>

                  {
                    like?.about && like?.about != '' &&
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
                        {like?.about}
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
                        {like?.city}
                      </Text>
                    </View>
                  </View>

                  {
                    like?.job != '' &&
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
                        {like?.job} {like?.job ? 'at' : null} {like?.company}
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
                      onPress={() => swipeLeft(like)}
                      style={{
                        backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                        paddingHorizontal: 10,
                        height: 35,
                        borderRadius: 8,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10
                      }}
                    >
                      <Text
                        style={{
                          color: color.red,
                          fontFamily: 'text'
                        }}
                      >
                        Nope
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => swipeRight(like)}
                      style={{
                        backgroundColor: color.goldDark,
                        paddingHorizontal: 10,
                        height: 35,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        style={{
                          color: color.white,
                          fontFamily: 'text'
                        }}
                      >
                        Match
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
          :
          <View
            style={{
              flex: 1,
              backgroundColor: color.transparent,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LoadingIndicator size={50} theme={theme} />
          </View>
      }
    </View>
  )
}

export default Likes