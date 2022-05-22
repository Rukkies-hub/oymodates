import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  FlatList,
  useWindowDimensions
} from 'react-native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'

import { Fontisto, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { Video } from 'expo-av'

import Likes from './Likes'

const Posts = () => {
  const navigation = useNavigation()
  const { userProfile, user, likes, setLikes } = useAuth()
  const video = useRef(null)
  const windowWidth = useWindowDimensions().width

  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState({})

  useEffect(() =>
    onSnapshot(collection(db, 'posts'),
      snapshot =>
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
    )
    , [])


  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <FlatList
      data={posts}
      bounces={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      keyExtractor={item => item.id}
      style={{
        flex: 1
      }}
      renderItem={({ item: post }) => (
        <View
          style={{
            flex: 1,
            marginBottom: 20,
            backgroundColor: color.white
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
                post?.user.id == user.uid ?
                  navigation.navigate('EditProfile') :
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
                  fontSize: 14,
                  color: color.dark
                }}
              >
                {post?.user?.displayName}
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
              <MaterialCommunityIcons name='dots-vertical' color={color.lightText} size={25} />
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
                    onPress={() => {
                      setLikes(post)
                      navigation.navigate('ViewPost', { post })
                    }}
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
                      setLikes(post)
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
              <Fontisto name="comment" size={24} color={color.lightText} />
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
              <AntDesign name="retweet" size={24} color={color.lightText} />
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
              post?.likes?.length > 0 &&
              <Text
                style={{
                  color: color.dark,
                  fontSize: 14
                }}
              >
                {post?.likes?.length} {post?.likes?.length == 1 ? 'Like' : 'Likes'}
              </Text>
            }
            <Text
              style={{
                color: color.dark,
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
                backgroundColor: color.offWhite,
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
                  color: color.lightText
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