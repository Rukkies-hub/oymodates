import React, { useState, useLayoutEffect } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import color from '../../style/color'
import Bar from '../../components/StatusBar'
import Header from '../../components/Header'

import { Feather, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import useAuth from '../../hooks/useAuth'
import { deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'

const UserDetails = ({ userProfile, user }) => {
  const { profiles } = useAuth()
  const navigation = useNavigation()

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: user?.followersCount })
  const [showMatch, setShowMatch] = useState(false)

  useLayoutEffect(() => {
    (() => {
      getLikesById(user?.id, userProfile?.id)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
  }, [user])

  useLayoutEffect(() => {
    const needle = user?.id
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (userSwiped) setShowMatch(true)
  }, [user])

  // FOLLOW USER
  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'users', user?.id, 'following', userProfile?.id))
      .then(res => resolve(res.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'users', user?.id, 'following', userProfile?.id))
      await updateDoc(doc(db, 'users', user?.id), {
        followersCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'users', user?.id, 'following', userProfile?.id), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        username: userProfile?.username
      })
      await updateDoc(doc(db, 'users', user?.id), {
        followersCount: increment(1)
      })
    }
  })

  const handleUpdateLikes = async () => {
    setCurrentLikesState({
      state: !currentLikesState.state,
      counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    })
    updateLike()
  }

  // MATCH WITH USER
  const swipeRight = async () => {
    const needle = user?.id
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', userProfile?.id, 'swipes', userSwiped.id))
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
        } else {
          setDoc(doc(db, 'users', userProfile?.id, 'swipes', userSwiped.id), userSwiped)
          setShowMatch(false)
        }
      })

    setDoc(doc(db, 'users', userSwiped.id, 'pendingSwipes', user?.id), userProfile)
    setDoc(doc(db, 'users', user?.id, 'swipes', userSwiped.id), userSwiped)
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <ImageBackground
      source={{ uri: user?.photoURL ? user?.photoURL : 'https://firebasestorage.googleapis.com/v0/b/oymo-16379.appspot.com/o/post%20image%2F1.jpg?alt=media&token=58bfeb2e-2316-4c9c-b8ba-513275ae85d1' }}
      blurRadius={50}
    >
      <LinearGradient
        colors={[color.transparent, userProfile?.theme == 'dark' ? color.black : color.white]}
        style={{
          paddingHorizontal: 10
        }}
      >
        <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

        <Header showBack showTitle title={user?.username} backgroundColor={color.transparent} showAratar />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            source={{ uri: user?.photoURL }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 100
            }}
          />

          <View
            style={{
              flex: 1,
              paddingLeft: 20,
              justifyContent: 'center'
            }}
          >
            {
              user?.username &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                  <Text
                    numberOfLines={1}
                  style={{
                    color: userProfile?.theme == 'light' ? color.dark : color.white,
                    fontFamily: 'boldText',
                    fontSize: 20
                  }}
                >
                  @{user?.username}
                </Text>
              </View>
            }

            {
              user?.displayName != '' &&
              <Text
                style={{
                  fontFamily: 'text',
                  color: userProfile?.theme == 'light' ? color.lightText : color.white
                }}
              >
                {user?.displayName}
              </Text>
            }
          </View>

          <TouchableOpacity
            onPress={handleUpdateLikes}
            style={{
              backgroundColor: color.red,
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
                fontFamily: 'text',
                fontSize: 12
              }}
            >
              {currentLikesState.state ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>

          {
            showMatch &&
            <TouchableOpacity
              onPress={swipeRight}
              style={{
                backgroundColor: color.red,
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5,
                borderRadius: 8
              }}
            >
              <MaterialCommunityIcons name='heart-multiple-outline' size={18} color={color.white} />
            </TouchableOpacity>
          }
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginRight: 20
            }}
          >
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 18,
                color: userProfile?.theme == 'light' ? color.black : color.white
              }}
            >
              {currentLikesState?.counter ? currentLikesState?.counter : '0'}
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: userProfile?.theme == 'light' ? color.lightText : color.white,
                marginLeft: 5
              }}
            >
              {currentLikesState?.counter == 1 ? 'Follower' : 'Followers'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 18,
                color: userProfile?.theme == 'light' ? color.black : color.white
              }}
            >
              {user?.likesCount ? user?.likesCount : '0'}
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: userProfile?.theme == 'light' ? color.lightText : color.white,
                marginLeft: 5
              }}
            >
              {user?.likesCount == 1 ? 'Like' : 'Likes'}
            </Text>
          </View>
        </View>

        {
          user?.about != '' &&
          <View
            style={{
              marginTop: 20
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: userProfile?.theme == 'light' ? color.dark : color.white
              }}
            >
              {user?.about}
            </Text>
          </View>
        }

        {
          user?.passions?.length > 1 &&
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 10
            }}
          >
            {
              user?.passions?.map((passion, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      backgroundColor: userProfile?.theme == 'dark' ? color.faintBlack : color.faintWhite,
                      borderRadius: 100,
                      marginBottom: 10,
                      marginRight: 5
                    }}
                  >
                    <Text
                      style={{
                        color: userProfile?.theme == 'dark' ? color.white : color.lightText,
                        fontSize: 12,
                        fontFamily: 'text',
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
        }

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Feather name='home' size={14} color={userProfile?.theme == 'light' ? color.dark : color.white} />

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
                fontSize: 16,
                color: userProfile?.theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              Lives in
            </Text>
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 16,
                color: userProfile?.theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              {user?.city}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Fontisto name='date' size={14} color={userProfile?.theme == 'light' ? color.dark : color.white} />

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
                fontSize: 16,
                color: userProfile?.theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              Joined
            </Text>
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 16,
                color: userProfile?.theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              {user?.timestamp?.toDate().toDateString()}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Feather name='briefcase' size={14} color={userProfile?.theme == 'light' ? color.dark : color.white} />

          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'light' ? color.dark : color.white,
              marginLeft: 10
            }}
          >
            {user?.job} {user?.job ? 'at' : null} {user?.company}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default UserDetails