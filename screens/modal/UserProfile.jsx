import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity
} from 'react-native'

import Header from '../../components/Header'
import Bar from '../../components/StatusBar'
import color from '../../style/color'
import { useFonts } from 'expo-font'
import { Feather, Fontisto, AntDesign } from '@expo/vector-icons'
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import AutoHeightImage from 'react-native-auto-height-image'
import useAuth from '../../hooks/useAuth'

const { width, height } = Dimensions.get('window')
const UserProfile = (params) => {
  const { user, userProfile } = useAuth()
  const currentUser = params?.route?.params?.user

  const [reels, setReels] = useState([])
  const [viewingUser, setViewingUser] = useState(null)
  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: viewingUser?.followersCount })

  useEffect(() =>
    onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', currentUser?.id)),
      snapshot => setReels(
        snapshot.docs.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      ))
    , [currentUser, db])

  const getUserProfile = async () => {
    const user = await getDoc(doc(db, 'users', currentUser?.id))
    setViewingUser(user.data())
  }

  useEffect(() => getUserProfile(), [])

  useEffect(() => {
    getLikesById(currentUser?.id, user.uid).then(res => {
      setCurrentLikesState({
        ...currentLikesState,
        state: res
      })
    })
  }, [currentUser])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'users', currentUser?.id, 'following', user?.uid))
      .then(res => resolve(res.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'users', currentUser?.id, 'following', user?.uid))
      await updateDoc(doc(db, 'users', currentUser?.id), {
        followersCount: increment(-1)
      }).then(() => getUserProfile())
    } else {
      await setDoc(doc(db, 'users', currentUser?.id, 'following', user?.uid), {
        id: userProfile?.id,
        photoURL: userProfile?.photoURL,
        username: userProfile?.username
      })
      await updateDoc(doc(db, 'users', currentUser?.id), {
        followersCount: increment(1)
      }).then(() => getUserProfile())
    }
  })

  const handleUpdateLikes = async () => {
    setCurrentLikesState({
      state: !currentLikesState.state,
      counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    })
    updateLike()
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar color={'dark'} />
      <Header showBack showTitle title={currentUser?.username} showAratar />

      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 10,
            marginTop: 20
          }}
        >
          <Image
            source={{ uri: currentUser?.photoURL }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 100
            }}
          />

          <Text
            style={{
              marginTop: 20,
              fontFamily: 'text',
              fontSize: 17,
              color: color.dark
            }}
          >
            @{currentUser?.username}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
            }}
          >
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
                  color: color.black
                }}
              >
                {viewingUser?.followersCount ? viewingUser?.followersCount : '0'}
              </Text>
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: color.lightText,
                  marginLeft: 5
                }}
              >
                {
                  viewingUser?.followersCount == 1 ? 'Follower' : 'Followers'
                }
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: 20
              }}
            >
              <Text
                style={{
                  fontFamily: 'boldText',
                  fontSize: 18,
                  color: color.black
                }}
              >
                55
              </Text>
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: color.lightText,
                  marginLeft: 5
                }}
              >
                Likes
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUpdateLikes}
            style={{
              marginHorizontal: 10,
              backgroundColor: color.red,
              width: '30%',
              height: 35,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
            }}
          >
            <Text
              style={{
                color: color.white,
                fontFamily: 'text',
                fontSize: 16
              }}
            >
              {
                currentLikesState.state ? 'Unfollow' : 'Follow'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginHorizontal: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.dark
            }}
          >
            {currentUser?.about}
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Feather name='home' size={14} color={color.dark} />

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
                color: color.dark,
                marginLeft: 5
              }}
            >
              Lives in
            </Text>
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 16,
                color: color.dark,
                marginLeft: 5
              }}
            >
              {currentUser?.city}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Fontisto name="date" size={14} color={color.dark} />

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
                color: color.dark,
                marginLeft: 5
              }}
            >
              Joined
            </Text>
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 16,
                color: color.dark,
                marginLeft: 5
              }}
            >
              {currentUser?.timestamp?.toDate().toDateString()}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Feather name="briefcase" size={14} color={color.dark} />

          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.dark,
              marginLeft: 10
            }}
          >
            {currentUser?.job} at {currentUser?.company}
          </Text>
        </View>

        {
          reels?.length > 0 &&
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              marginTop: 20
            }}
          >
            {
              reels.map((reel, index) => (
                <Pressable
                  key={index}
                  style={{
                    width: '30%',
                    height: (width - 10) / 3,
                    margin: 3
                  }}
                >
                  <AutoHeightImage
                    source={{ uri: reel?.thumbnail }}
                    width={width / 3}
                    style={{
                      flex: 1
                    }}
                  />
                </Pressable>
              ))
            }
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserProfile