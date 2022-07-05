import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Image, FlatList } from 'react-native'

import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { db } from '../../hooks/firebase'
import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import { Video } from 'expo-av'


const MyPosts = () => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()

  const [posts, setPosts] = useState([])

  useEffect(() =>
    (() => {
      onSnapshot(query(collection(db, 'posts'),
        where('user.id', '==', user?.uid)),
        snapshot => setPosts(
          snapshot.docs.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        ))
    })()
    , [user, db])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
      renderItem={({ item: post }) => (
        <Pressable
          onPress={() => navigation.navigate('ViewPost', { post })}
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginBottom: 20
          }}
        >
          {
            post?.mediaType != 'video' ?
              <Image
                source={{ uri: post?.media }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  marginRight: 10
                }}
              /> :
              <Video
                source={{ uri: post?.media }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  marginRight: 10
                }}
              />
          }

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: userProfile?.theme == 'dark' ? color.white : color.black,
                fontSize: 18
              }}
            >
              {post?.caption}
            </Text>

            <Text
              style={{
                color: userProfile?.theme == 'dark' ? color.white : color.dark,
                fontSize: 13
              }}
            >
              Video - {post?.user?.username}
            </Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-end'
              }}
            >
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
                <Text
                  style={{
                    marginRight: 5,
                    fontFamily: 'text',
                    color: userProfile?.theme == 'dark' ? color.white : color.dark
                  }}
                >
                  {post?.likesCount}
                </Text>
                <Text
                  style={{
                    color: userProfile?.theme == 'dark' ? color.white : color.lightText,
                    fontFamily: 'text'
                  }}
                >
                  {post?.likesCount == 1 ? 'Like' : 'Likes'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10
                }}
              >
                <Text
                  style={{
                    marginRight: 5,
                    fontFamily: 'text',
                    color: userProfile?.theme == 'dark' ? color.white : color.dark
                  }}
                >
                  {post?.commentsCount}
                </Text>
                <Text
                  style={{
                    color: userProfile?.theme == 'dark' ? color.white : color.lightText,
                    fontFamily: 'text'
                  }}
                >
                  {post?.commentsCount == 1 ? 'Comment' : 'Comments'}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      )}
    />
  )
}

export default MyPosts