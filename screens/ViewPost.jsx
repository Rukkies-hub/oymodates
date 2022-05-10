import React, { useState, useRef } from 'react'
import { View, Text, useWindowDimensions, Image, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import Header from '../components/Header'
import color from '../style/color'

import { Video } from 'expo-av'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import useAuth from '../hooks/useAuth'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import NewComment from '../components/NewComment'
import Comments from '../components/Comments'
import { useNavigation } from '@react-navigation/native'

const ViewPost = (params) => {
  const navigation = useNavigation()
  const { user, likes, setLikes } = useAuth()
  const post = params.route.params.post


  const windowWidth = useWindowDimensions().width

  const video = useRef(null)
  const [status, setStatus] = useState({})
  const [mute, setMute] = useState(true)

  const likePost = async () => {
    await updateDoc(doc(db, 'posts', post.id), {
      likes: arrayUnion(user.uid)
    })

    getLikes()
  }

  const dislikePost = async () => {
    await updateDoc(doc(db, 'posts', post.id), {
      likes: arrayRemove(user.uid)
    })

    getLikes()
  }

  const getLikes = async () => {
    let docSnap = await (await getDoc(doc(db, 'posts', post.id))).data()
    setLikes(docSnap)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
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
              post?.user.id == user.uid ?
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
                fontSize: 14,
                color: color.dark
              }}
            >
              {post?.user?.displayName}
            </Text>
          </Pressable>
        </View>

        {
          post.mediaType == 'image' ?
            <View
              style={{
                position: 'relative'
              }}
            >
              <Image
                source={{ uri: post?.media[0] }}
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
                  backgroundColor: color.black
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

          {
            likes?.likes?.includes(user.uid) &&
            <TouchableOpacity
              onPress={dislikePost}
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20
              }}
            >
              <MaterialCommunityIcons name='heart' size={25} color={color.red} />
            </TouchableOpacity>
          }
          {
            !likes?.likes?.includes(user.uid) &&
            <TouchableOpacity
              onPress={likePost}
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20
              }}
            >
              <MaterialCommunityIcons name='heart-outline' size={25} color={color.lightText} />
            </TouchableOpacity>
          }

          <Pressable
            // onPress={() => navigation.navigate('AddComment', { post })}
            style={{
              width: 35,
              height: 35,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 20
            }}
          >
            <FontAwesome5 name='comments' size={25} color={color.lightText} />
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
            <FontAwesome5 name='paper-plane' size={25} color={color.lightText} />
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
            likes?.likes?.length > 0 &&
            <Text
              style={{
                color: color.dark,
                fontSize: 14
              }}
            >
              {likes?.likes?.length} {likes?.likes?.length == 1 ? 'Like' : 'Likes'}
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
        </View>
        <View
          style={{
            marginTop: 30
          }}
        ></View>
        <Comments post={post} />
      </ScrollView>
      <NewComment post={post} />
    </View>
  )
}

export default ViewPost