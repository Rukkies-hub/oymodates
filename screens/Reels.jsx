import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity, Image, ImageBackground } from 'react-native'

import { arrayRemove, arrayUnion, collection, doc, getDocs, limit, onSnapshot, query, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import color from '../style/color'
import PostSingle from '../components/PostSingle'

const { width, height } = Dimensions.get('window')

import { AntDesign, FontAwesome } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import { LinearGradient } from 'expo-linear-gradient'

import useAuth from '../hooks/useAuth'
import LikeReels from '../components/LikeReels'
import { useNavigation } from '@react-navigation/native'

const Reels = () => {
  const {
    userProfile,
    user,
    reelsProps,
    setReelsProps,
    reels,
    setReels,
    reelsLimit,
    setReelsLimit } = useAuth()
  const mediaRefs = useRef([])

  const navigation = useNavigation()

  const onViewableItemsChanged = useRef(({ changed }) => {
    changed?.forEach(element => {
      const cell = mediaRefs?.current[element?.key]
      if (cell) {
        if (element?.isViewable) {
          cell?.play()
        } else {
          cell?.stop()
        }
      }
    })
  })

  const getReels = async () => {
    const queryReels = await getDocs(query(collection(db, 'reels'), limit(reelsLimit)))

    setReels(
      queryReels?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }))
    )
  }

  const likeReel = async (item) => {
    let reels = item

    reels?.likes?.includes(user?.uid) ?
      await updateDoc(doc(db, 'reels', reels?.id), {
        likes: arrayRemove(userProfile?.id)
      }) :
      await updateDoc(doc(db, 'reels', reels?.id), {
        likes: arrayUnion(userProfile?.id)
      })
  }

  const disabled = () => {
    console.log('not logged in')
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  const renderItem = ({ item, index }) => {
    return (
      <ImageBackground
        source={{ uri: item?.thumbnail }}
        resizeMode='cover'
        blurRadius={50}
        style={{
          flex: 1,
          width,
          height: userProfile?.layout == 'bottom' ? height - 108 : height - 100,
          backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: userProfile?.theme == 'dark' ? 8 : 0,
          overflow: 'hidden'
        }}
      >
        <PostSingle item={item} ref={PostSingleRef => (mediaRefs.current[item?.id] = PostSingleRef)} />

        <LinearGradient
          colors={['transparent', color.labelColor]}
          style={{
            position: 'absolute',
            bottom: 0,
            width,
            height: height / 3,
            zIndex: 1
          }}
        >
          {/* CAPTION */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              marginBottom: 20,
              marginLeft: 10
            }}
          >
            <TouchableOpacity
              onPress={() => item?.user?.id == userProfile?.id ? navigation.navigate('Profile') : navigation.navigate('UserProfile', { user: item?.user })}
            >
              <Text
                style={{
                  color: color.white,
                  fontFamily: 'text',
                  fontSize: 16
                }}
              >
                @{item?.user?.username}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: color.white,
                fontSize: 16
              }}
            >
              {item?.description}
            </Text>
          </View>

          {/* CONTROLS */}
          <View
            style={{
              marginVertical: 30,
              position: 'absolute',
              right: 0,
              bottom: 0,
              margin: 20
            }}
          >
            <TouchableOpacity
              onPress={() => item?.user?.id == userProfile?.id ? navigation.navigate('Profile') : navigation.navigate('UserProfile', { user: item?.user })}
              style={{
                width: 50,
                height: 50,
                borderWidth: 4,
                borderRadius: 100,
                borderColor: color.white,
                overflow: 'hidden'
              }}
            >
              <Image
                source={{ uri: item?.user?.photoURL }}
                style={{
                  width: 50,
                  height: 50
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                paddingVertical: 10,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20
              }}
            >
              <LikeReels reel={item} />

              <TouchableOpacity
                onPress={() => {
                  userProfile ? setReelsProps(item) : null
                  userProfile ? navigation.navigate('ReelsComment', { item }) : disabled()
                }}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FontAwesome name='comment' size={24} color={color.white} />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    marginTop: 5
                  }}
                >
                  {item?.commentsCount ? item?.commentsCount : '0'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >

      <View
        style={{
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <FlatList
          data={reels}
          windowSize={2}
          initialNumToRender={0}
          maxToRenderPerBatch={1}
          removeClippedSubviews
          viewabilityConfig={{
            itemVisiblePercentThreshold: 75
          }}
          renderItem={renderItem}
          pagingEnabled
          keyExtractor={item => item?.id}
          decelerationRate={'normal'}
          onViewableItemsChanged={onViewableItemsChanged?.current}
          showsVerticalScrollIndicator={false}
          vertical={true}
          scrollEnabled={true}
          style={{ flex: 1 }}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            setReelsLimit(reelsLimit + 3)
            getReels()
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Reels