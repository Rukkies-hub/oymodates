import React, { useState, useEffect, useLayoutEffect } from 'react'
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

import { useNavigation, useRoute } from '@react-navigation/native'

import Header from '../../components/Header'
import Bar from '../../components/StatusBar'
import color from '../../style/color'
import { useFonts } from 'expo-font'
import { Feather, Fontisto, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import AutoHeightImage from 'react-native-auto-height-image'
import useAuth from '../../hooks/useAuth'
import UserPosts from './UserPosts'
import UserReels from './UserReels'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

const { width, height } = Dimensions.get('window')

const UserProfile = (params) => {
  const { userProfile, setViewUser } = useAuth()
  const { user } = useRoute().params
  const navigation = useNavigation()

  const [reels, setReels] = useState([])
  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: user?.followersCount })

  useLayoutEffect(() => {
    setViewUser(user)
  }, [user])

  // useEffect(() =>
  //   (() => {
  //     onSnapshot(query(collection(db, 'reels'),
  //       where('user.id', '==', currentUser?.id)),
  //       snapshot => setReels(
  //         snapshot.docs.map(doc => ({
  //           id: doc?.id,
  //           ...doc?.data()
  //         }))
  //       ))
  //   })()
  //   , [currentUser, db])

  // useEffect(() => {
  //   (() => {
  //     getLikesById(currentUser?.id, userProfile?.id).then(res => {
  //       setCurrentLikesState({
  //         ...currentLikesState,
  //         state: res
  //       })
  //     })
  //   })()
  // }, [currentUser])

  // const getLikesById = () => new Promise(async (resolve, reject) => {
  //   getDoc(doc(db, 'users', currentUser?.id, 'following', userProfile?.id))
  //     .then(res => resolve(res.exists()))
  // })

  // const updateLike = () => new Promise(async (resolve, reject) => {
  //   if (currentLikesState.state) {
  //     await deleteDoc(doc(db, 'users', currentUser?.id, 'following', userProfile?.id))
  //     await updateDoc(doc(db, 'users', currentUser?.id), {
  //       followersCount: increment(-1)
  //     }).then(() => getUserProfile(user))
  //   } else {
  //     await setDoc(doc(db, 'users', currentUser?.id, 'following', userProfile?.id), {
  //       id: userProfile?.id,
  //       photoURL: userProfile?.photoURL,
  //       username: userProfile?.username
  //     })
  //     await updateDoc(doc(db, 'users', currentUser?.id), {
  //       followersCount: increment(1)
  //     }).then(() => getUserProfile(user))
  //   }
  // })

  const handleUpdateLikes = async () => {
    // setCurrentLikesState({
    //   state: !currentLikesState.state,
    //   counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    // })
    // updateLike()
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
        backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

      <Header showBack showTitle title={user?.username} showAratar />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 20
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
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.theme == 'light' ? color.lightText : color.white
            }}
          >
            {user?.displayName}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleUpdateLikes}
          style={{
            backgroundColor: color.red,
            paddingHorizontal: 20,
            height: 35,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center'
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

        <TouchableOpacity
        >
          <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={color.white} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginHorizontal: 10
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
            {user?.followersCount ? user?.followersCount : '0'}
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'light' ? color.lightText : color.white,
              marginLeft: 5
            }}
          >
            {user?.followersCount == 1 ? 'Follower' : 'Followers'}
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
            marginHorizontal: 10,
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

      <View
        style={{
          marginHorizontal: 10,
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
          marginHorizontal: 10,
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
          marginHorizontal: 10,
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

      <Tab.Navigator
        initialRouteName='UserReels'
        barStyle={{
          backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
          height: 50,
          elevation: 0
        }}
        keyboardDismissMode='auto'
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
            height: 50,
            elevation: 0
          },
          tabBarIndicatorStyle: {
            backgroundColor: userProfile.theme == 'dark' ? color.offWhite : color.dark,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50
          }
        }}
      >
        <Tab.Screen
          name='UserReels'
          component={UserReels}
          options={{
            tabBarIcon: () =>
              <Image
                source={userProfile?.theme == 'dark' ? require('../../assets/videoLight.png') : require('../../assets/video.png')}
                style={{
                  width: 20,
                  height: 20
                }}
              />
          }}
        />
        <Tab.Screen
          name='UserPosts'
          component={UserPosts}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name='grid' size={20} color={userProfile?.theme == 'dark' ? color.white : color.black} />
          }}
        />
      </Tab.Navigator>

      {/* <ScrollView>
        {
          reels?.length > 0 &&
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              marginTop: 20
            }}
          >
            {
              reels.map((reel, index) => (
                <Pressable
                  key={index}
                  onPress={() => navigation.navigate('ViewReel', { reel })}
                  style={{
                    width: '30%',
                    height: (width - 10) / 3,
                    margin: 3
                  }}
                >
                  <AutoHeightImage
                    source={{ uri: reel?.thumbnail }}
                    width={width / 3}
                    style={{ flex: 1 }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      margin: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      backgroundColor: color.faintBlack,
                      padding: 5,
                      borderRadius: 50
                    }}
                  >
                    <AntDesign name='heart' size={18} color={color.white} />
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        marginLeft: 10,
                        color: color.white,
                        fontSize: 18
                      }}
                    >
                      {reel?.likesCount}
                    </Text>
                  </View>
                </Pressable>
              ))
            }
          </View>
        }
      </ScrollView> */}
    </SafeAreaView>
  )
}

export default UserProfile