import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, Pressable, Image, FlatList, ActivityIndicator, ImageBackground } from 'react-native'

import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'


const UserReels = () => {
  const { userProfile, viewUser } = useAuth()
  const navigation = useNavigation()

  const [reels, setReels] = useState([])
  const [reelsLimit, setLimit] = useState(4)

  useLayoutEffect(() => {
    onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', viewUser?.id), limit(reelsLimit)),
      snapshot => setReels(
        snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      ))
  }, [reelsLimit, db])

  const getReels = async () => {
    const queryReels = await getDocs(query(collection(db, 'reels'), where('user.id', '==', viewUser?.id), limit(reelsLimit)))

    setReels(
      queryReels?.docs?.map(doc => ({
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
        reels?.length < 1 ?
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
            }}
          >
            <ActivityIndicator size='large' color={color.red} />
          </View> :
          <FlatList
            data={reels}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingTop: 10,
              backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
            }}
            onEndReached={() => {
              setLimit(reelsLimit + 4)
              getReels()
            }}
            ListFooterComponent={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 50
                }}
              />
            )}
            renderItem={({ item: reel }) => (
              <Pressable
                onPress={() => navigation.navigate('ViewReel', { reel })}
                onLongPress={() => navigation.navigate('ReelsOption', { reel })}
                delayLongPress={100}
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  marginBottom: 20
                }}
              >
                <Image
                  source={{ uri: reel?.thumbnail }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    marginRight: 10
                  }}
                />

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
                    {reel?.description}
                  </Text>

                  <Text
                    style={{
                      color: userProfile?.theme == 'dark' ? color.white : color.dark,
                      fontSize: 13
                    }}
                  >
                    Video - {reel?.user?.username}
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
                        {reel?.likesCount}
                      </Text>
                      <Text
                        style={{
                          color: userProfile?.theme == 'dark' ? color.white : color.lightText,
                          fontFamily: 'text'
                        }}
                      >
                        {reel?.likesCount == 1 ? 'Like' : 'Likes'}
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
                        {reel?.commentsCount}
                      </Text>
                      <Text
                        style={{
                          color: userProfile?.theme == 'dark' ? color.white : color.lightText,
                          fontFamily: 'text'
                        }}
                      >
                        {reel?.commentsCount == 1 ? 'Comment' : 'Comments'}
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

export default UserReels
// in use