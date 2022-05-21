import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native'

import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import Header from '../components/Header'

import color from '../style/color'
import PostSingle from '../components/PostSingle'

const { width, height } = Dimensions.get('window')

import { AntDesign, Fontisto } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import { LinearGradient } from 'expo-linear-gradient'

const Reels = () => {
  const mediaRefs = useRef([])

  const onViewableItemsChanged = useRef(({ changed }) => {
    changed.forEach(element => {
      const cell = mediaRefs.current[element.key]
      if (cell) {
        console.log('onViewableItemsChanged: ', element, element.isViewable)
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
    , [])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          width,
          height: height - 108
        }}
      >
        <PostSingle item={item} ref={PostSingleRef => (mediaRefs.current[item.id] = PostSingleRef)} />

        
        <LinearGradient
          colors={['transparent', color.labelColor]}
          style={{
            position: 'absolute',
            bottom: 0,
            width,
            height: height / 3
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
                fontSize: 18
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
                marginTop: 10
              }}
            >
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20
                }}
              >
                <AntDesign name="hearto" size={24} color={color.white} />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text'
                  }}
                >
                  0
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Fontisto name="comment" size={24} color={color.white} />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text'
                  }}
                >
                  0
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
      <Header showLogo showAratar showAdd />

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