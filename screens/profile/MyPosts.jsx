import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image, FlatList, ActivityIndicator } from 'react-native'

import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'


const MyPosts = () => {
  const { userProfile, user } = useAuth()
  const navigation = useNavigation()

  const [posts, setPosts] = useState([])
  const [postsLimit, setLimit] = useState(4)

  useEffect(() => {
    (() => {
      onSnapshot(query(collection(db, 'posts'),
        where('user.id', '==', user?.uid), limit(4)),
        snapshot => setPosts(
          snapshot.docs.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        ))
    })()
  }, [postsLimit, db])

  const getPosts = async () => {
    const queryPosts = await getDocs(query(collection(db, 'posts'), where('user.id', '==', user?.uid), limit(postsLimit)))

    setPosts(
      queryPosts?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }))
    )
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <>
      {
        posts?.length < 1 ?
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: userProfile?.photoURL }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100
                  }}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.white,
                    position: 'absolute',
                    top: -13,
                    right: -13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: color.black,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <ActivityIndicator size='small' color={color.red} />
                </View>
              </View>
            </View>
          </View> :
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
            onEndReached={() => {
              setLimit(postsLimit + 4)
              getPosts()
            }}
            ListFooterComponent={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 50
                }}
              >
                <ActivityIndicator size='large' color={userProfile?.theme == 'dark' ? color.white : color.dark} />
                <Text
                  style={{
                    color: userProfile?.theme == 'dark' ? color.white : color.dark,
                    fontFamily: 'text',
                    marginLeft: 10
                  }}
                >
                  Loading Feeds...
                </Text>
              </View>
            )}
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
                  post?.mediaType == 'video' &&
                  <Image
                    source={{ uri: post?.thumbnail }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      marginRight: 10
                    }}
                  />
                }

                {
                  post?.mediaType == 'image' &&
                  <Image
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
                  {
                    post?.caption &&
                    <Text
                      numberOfLines={1}
                      style={{
                        color: userProfile?.theme == 'dark' ? color.white : color.black,
                        fontSize: 18
                      }}
                    >
                      {post?.caption}
                    </Text>
                  }

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
      }
    </>
  )
}

export default MyPosts