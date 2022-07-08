import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import { db } from '../hooks/firebase'

import useAuth from '../hooks/useAuth'

import color from '../style/color'

import Header from '../components/Header'

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import generateId from '../lib/generateId'
import { useNavigation } from '@react-navigation/native'

const AllPostLikes = (props) => {
  const navigation = useNavigation()
  const post = props?.route?.params?.post
  const { user, userProfile, profiles } = useAuth()

  const [allLikes, setAllLikes] = useState([])

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, 'posts', post?.id, 'likes'))
      setAllLikes(
        querySnapshot.docs.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    })()
  }, [post])

  console.log(allLikes)

  const swipeRight = like => {
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
        backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black
      }}
    >
      <Header showBack showTitle title='All likes' />
      <FlatList
        data={allLikes}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        renderItem={({ item: user }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <View>
                <Image
                  source={{ uri: user?.photoURL }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50
                  }}
                />

                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: -4,
                    backgroundColor: color.red,
                    borderRadius: 50,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <AntDesign name='heart' size={10} color={color.white} />
                </View>
              </View>
              <Text
                style={{
                  color: userProfile?.theme == 'light' ? color.dark : color.white,
                  fontFamily: 'text',
                  fontSize: 16,
                  marginLeft: 12
                }}
              >
                {user?.username}
              </Text>
            </TouchableOpacity>

            {
              user?.id != userProfile?.id &&
              <TouchableOpacity
                onPress={() => swipeRight(user)}
                style={{
                  backgroundColor: color.red,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  marginLeft: 10,
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: color.white,
                    fontSize: 14
                  }}
                >
                  Match
                </Text>
              </TouchableOpacity>
            }
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default AllPostLikes