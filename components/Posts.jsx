import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  FlatList
} from 'react-native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { arrayRemove, collection, doc, FieldValue, Firestore, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

const Posts = () => {
  const { userProfile, user } = useAuth()

  const [posts, setPosts] = useState([])

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

  const likePost = async (post) => {
    await updateDoc(doc(db, 'posts', post.id), {
      likes: [user.uid]
    })
  }

  const dislikePost = async (post) => {
    await updateDoc(doc(db, 'posts', post.id), {
      likes: arrayRemove(user.uid)
    })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      style={{
        flex: 1
      }}
      renderItem={({ item: post }) => (
        <View
          style={{
            flex: 1,
            marginTop: 10,
            marginBottom: 50
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

          <View
            style={{
              paddingHorizontal: 10,
              minHeight: 40,
              maxHeight: 100,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: color.dark,
                fontSize: 16
              }}
            >
              {post?.caption}
            </Text>
          </View>

          <Image
            source={{ uri: post?.media[0] }}
            style={{
              width: '100%',
              height: 400
            }}
          />

          <View
            style={{
              padding: 10,
              flexDirection: 'row'
            }}
          >
            {
              post?.likes?.includes(user.uid) &&
              <TouchableOpacity
                onPress={() => dislikePost(post)}
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
              !post?.likes?.includes(user.uid) &&
              <TouchableOpacity
                onPress={() => likePost(post)}
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

          <TouchableOpacity
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