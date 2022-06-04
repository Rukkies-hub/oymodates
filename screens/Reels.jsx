import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native'

import { arrayRemove, arrayUnion, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import color from '../style/color'
import PostSingle from '../components/PostSingle'

const { width, height } = Dimensions.get('window')

import { AntDesign, FontAwesome } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import { LinearGradient } from 'expo-linear-gradient'

import useAuth from '../hooks/useAuth'
import ReelsCommentSheet from './modal/ReelsCommentSheet'
import LikeReels from '../components/LikeReels'

const Reels = () => {
  const { setBottomSheetIndex, userProfile, user, reelsProps, setReelsProps } = useAuth()
  const mediaRefs = useRef([])

  const onViewableItemsChanged = useRef(({ changed }) => {
    changed.forEach(element => {
      const cell = mediaRefs.current[element.key]
      if (cell) {
        if (element.isViewable) {
          cell.play()
        } else {
          cell.stop()
        }
      }
    })
  })

  const [reels, setReels] = useState([])

  useEffect(() =>
    onSnapshot(collection(db, 'reels'),
      snapshot =>
        setReels(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
    )
    , [db])

  const likeReel = async (item) => {
    let reels = item

    reels?.likes?.includes(user.uid) ?
      await updateDoc(doc(db, 'reels', reels?.id), {
        likes: arrayRemove(userProfile?.id)
      }) :
      await updateDoc(doc(db, 'reels', reels?.id), {
        likes: arrayUnion(userProfile?.id)
      })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          width,
          height: height - 109,
          backgroundColor: userProfile?.appMode != 'light' ? color.white : color.dark
        }}
      >
        <PostSingle item={item} ref={PostSingleRef => (mediaRefs.current[item.id] = PostSingleRef)} />

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
            <Text
              style={{
                color: color.white,
                fontFamily: 'text',
                fontSize: 16
              }}
            >
              {item?.user?.displayName}
            </Text>
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
                  setBottomSheetIndex(0)
                  setReelsProps(item)
                }}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FontAwesome name="comment" size={24} color={color.white} />
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
      </View>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
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
          keyExtractor={item => item.id}
          decelerationRate={'normal'}
          onViewableItemsChanged={onViewableItemsChanged.current}
          showsVerticalScrollIndicator={false}
          vertical={true}
          scrollEnabled={true}
          style={{ flex: 1 }}
          onEndReachedThreshold={0.1}
        />
      </View>
    </SafeAreaView>
  )
}

export default Reels