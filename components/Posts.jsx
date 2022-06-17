import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native'


import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'

import { Fontisto, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

import { collection, getDocs, limit, onSnapshot, query } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useNavigation } from '@react-navigation/native'

import Likes from './Likes'

const { width, height } = Dimensions.get('window')

import PostImage from './PostImage'
import PostVideo from './PostVideo'

const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout))

const Posts = () => {
  const navigation = useNavigation()
  const { userProfile, user } = useAuth()
  const windowWidth = useWindowDimensions().width

  const [posts, setPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [postLimit, setPostLimit] = useState(3)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => {
      getPosts()
      setRefreshing(false)
    })
  }, [])

  const getPosts = async () => {
    const queryPosts = await getDocs(query(collection(db, 'posts'), limit(postLimit)))

    setPosts(
      queryPosts?.docs?.map(doc => ({
        id: doc?.id,
        ...doc.data()
      }))
    )
  }

  useEffect(() => {
    getPosts()
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
      initialNumToRender={0}
      maxToRenderPerBatch={1}
      onEndReached={() => {
        setPostLimit(postLimit + 3)
        getPosts()
      }}
      onEndReachedThreshold={0.1}
      removeClippedSubviews
      viewabilityConfig={{
        itemVisiblePercentThreshold: 75
      }}
      ListFooterComponent={() => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator size='large' color={userProfile?.appMode == 'light' ? color.dark : color.white} />
          <Text
            style={{
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              fontFamily: 'text',
              marginLeft: 10
            }}
          >
            Loading Feeds....
          </Text>
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      keyExtractor={item => item.id}
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
                  <PostImage post={post} />
                </View> :
                <PostVideo post={post} />
            }
          </View>

          <View
            style={{
              padding: 10,
              flexDirection: 'row'
            }}
          >
            <Likes post={post} />

            <TouchableOpacity
              onPress={() => navigation.navigate('AddComment', { post })}
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20
              }}
            >
              <Fontisto name='comment' size={24} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20
              }}
            >
              <AntDesign name='retweet' size={24} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity
            // onPress={() => navigation.navigate('ViewPost', { post })}
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
        </View>
      )}
    />
  )
}

export default Posts