import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Dimensions,
  RefreshControl
} from 'react-native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'

import { Fontisto, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { Video } from 'expo-av'

import Likes from './Likes'

const { width, height } = Dimensions.get('window')

import AsyncStorage from '@react-native-async-storage/async-storage'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Posts = () => {
  const navigation = useNavigation()
  const { userProfile, user } = useAuth()
  const video = useRef(null)
  const windowWidth = useWindowDimensions().width

  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState({})
  const [refreshing, setRefreshing] = React.useState(false)

  const getPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'))

    setPosts(
      querySnapshot?.docs?.map(doc => ({
        id: doc.id,
        ...doc?.data()
      }))
    )
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => {
      getPosts()
      setRefreshing(false)
    })
  }, [])

  useEffect(async () => {
    const postCache = await AsyncStorage.getItem('posts')
    if (postCache) {
      setPosts(JSON.parse(postCache))
    } else {
      getPosts()
      await AsyncStorage.setItem('posts', JSON.stringify(posts))
    }
  }, [])


  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <FlatList
      data={posts}
      bounces={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      style={{
        flex: 1,
        height: height - 109
      }}
      renderItem={({ item: post }) => (
        <View
          style={{
            flex: 1,
            marginBottom: 20,
            backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
          }}
        >
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Pressable
              onPress={() =>
                post?.user?.id == user?.uid ?
                  navigation.navigate('Profile') :
                  navigation.navigate('UserProfile', { user: post?.user })
              }
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Image
                source={{ uri: post?.user?.photoURL }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50
                }}
              />
              <Text
                style={{
                  fontFamily: 'text',
                  marginLeft: 10,
                  fontSize: 18,
                  color: userProfile?.appMode == 'light' ? color.dark : color.white
                }}
              >
                {post?.user?.username}
              </Text>
            </Pressable>

            <TouchableOpacity
              style={{
                height: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <MaterialCommunityIcons name='dots-vertical' color={userProfile?.appMode == 'light' ? color.lightText : color.white} size={25} />
            </TouchableOpacity>
          </View>

          <View>
            {
              post?.mediaType == 'image' ?
                <View
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: windowWidth,
                    position: 'relative',
                    backgroundColor: color.black
                  }}
                >
                  <Image
                    source={{ uri: post?.media }}
                    style={{
                      width: '100%',
                      height: 400
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ViewPost', { post })}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </View> :
                <View
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: windowWidth,
                    position: 'relative',
                    backgroundColor: color.black
                  }}
                >
                  <Video
                    isLooping
                    ref={video}
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: windowWidth,
                      height: 522,
                      minHeight: 300,
                    }}
                    source={{
                      uri: post?.media,
                    }}
                    useNativeControls={false}
                    resizeMode='cover'
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ViewPost', { post })
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </View>
            }
          </View>

          <View
            style={{
              padding: 10,
              flexDirection: 'row'
            }}
          >
            <Likes post={post} />

            <Pressable
              onPress={() => navigation.navigate('AddComment', { post })}
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20
              }}
            >
              <Fontisto name="comment" size={24} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
            </Pressable>

            <Pressable
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20
              }}
            >
              <AntDesign name="retweet" size={24} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
            </Pressable>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ViewPost', { post })}
            style={{
              paddingHorizontal: 10,
              maxHeight: 100,
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}
          >

            {
              post?.likesCount > 0 &&
              <TouchableOpacity
                onPress={() => navigation.navigate('AllPostLikes', { post })}
              >
                <Text
                  style={{
                    color: userProfile?.appMode == 'light' ? color.dark : color.white,
                    fontSize: 14
                  }}
                >
                  {post?.likesCount} {post?.likesCount > 1 ? 'Likes' : 'Like'}
                </Text>
              </TouchableOpacity>
            }
            <Text
              style={{
                color: userProfile?.appMode == 'light' ? color.dark : color.white,
                fontSize: 16
              }}
            >
              {post?.caption}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AddComment', { post })}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingHorizontal: 10,
              marginTop: 10
            }}
          >
            <Image
              source={{ uri: userProfile?.photoURL || user?.photoURL }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50,
                marginRight: 10
              }}
            />

            <View
              style={{
                backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 12,
                height: 40,
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: userProfile?.appMode == 'light' ? color.lightText : color.white
                }}
              >
                Write a comment...
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  )
}

export default Posts