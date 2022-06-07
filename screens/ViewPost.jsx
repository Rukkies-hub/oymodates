import React, { useState, useRef } from 'react'
import { View, Text, useWindowDimensions, Image, Pressable, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import Header from '../components/Header'
import color from '../style/color'

import { Video } from 'expo-av'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { AntDesign, Fontisto } from '@expo/vector-icons'

import useAuth from '../hooks/useAuth'

import NewComment from '../components/NewComment'
import Comments from '../components/Comments'
import { useNavigation } from '@react-navigation/native'
import Likes from '../components/Likes'

const ViewPost = (params) => {
  const navigation = useNavigation()
  const { user, userProfile } = useAuth()
  const post = params?.route?.params?.post

  const windowWidth = useWindowDimensions().width

  const video = useRef(null)
  const [status, setStatus] = useState({})
  const [mute, setMute] = useState(true)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
      }}
    >
      <Header showBack showTitle title='View Post' />
      <ScrollView
        style={{
          flex: 1
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
                color: userProfile?.appMode == 'light' ? color.dark : color.white
              }}
            >
              {post?.user?.username}
            </Text>
          </Pressable>
        </View>

        {
          post?.mediaType == 'image' ?
            <View
              style={{
                position: 'relative'
              }}
            >
              <Image
                source={{ uri: post?.media }}
                style={{
                  width: '100%',
                  height: 400
                }}
              />
            </View> :
            <View
              style={{
                position: 'relative'
              }}
            >
              <Video
                ref={video}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: windowWidth,
                  height: 522,
                  minHeight: 300,
                  backgroundColor: userProfile?.appMode == 'light' ? color.black : color.white
                }}
                source={{
                  uri: post?.media[0],
                }}
                useNativeControls={false}
                resizeMode="cover"
                isMuted={mute}
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
              />

              <TouchableOpacity
                onPress={() =>
                  status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%'
                }}
              />

              <TouchableOpacity
                onPress={() => setMute(!mute)}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  margin: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: `${color.dark}89`,
                  borderRadius: 50,
                  zIndex: 1,
                  width: 50,
                  height: 50
                }}
              >
                <MaterialCommunityIcons name={mute ? 'volume-high' : 'volume-mute'} size={24} color={color.white} />
              </TouchableOpacity>
            </View>
        }

        <View
          style={{
            padding: 10,
            flexDirection: 'row'
          }}
        >

          <Likes post={post} />

          <Pressable
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

        <View
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
        </View>
        <View
          style={{
            marginTop: 30
          }}
        />
        <Comments post={post} />
      </ScrollView>
      <NewComment post={post} />
    </SafeAreaView>
  )
}

export default ViewPost