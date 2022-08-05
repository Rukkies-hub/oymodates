import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity, Image, ImageBackground, RefreshControl } from 'react-native'

import { arrayRemove, arrayUnion, collection, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import color from '../../style/color'
import ReelsSingle from './components/ReelsSingle'

const { width, height } = Dimensions.get('window')

import { AntDesign, FontAwesome } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import { LinearGradient } from 'expo-linear-gradient'

import useAuth from '../../hooks/useAuth'
import LikeReels from '../../components/LikeReels'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import UserInfo from './components/UserInfo'
import UserAvatar from './components/UserAvatar'

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Reels = () => {
  const {
    userProfile,
    setReelsProps,
    reels,
    reelsLimit,
    getReels,
    setReelsLimit,
    theme
  } = useAuth()
  const mediaRefs = useRef([])

  const [refreshing, setRefreshing] = useState(false)

  const navigation = useNavigation()
  const focus = useIsFocused()

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => {
      getReels()
      setRefreshing(false)
    })
  }, [])

  const disabled = () => navigation.navigate('SetupModal')

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  const renderItem = ({ item, index }) => {
    return (
      <ImageBackground
        source={{ uri: item?.thumbnail }}
        resizeMode='cover'
        blurRadius={50}
        style={[
          {
            flex: 1,
            width,
            height: height - 108,
            backgroundColor: color.transparent,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            overflow: 'hidden'
          },
          index % 2 ? {
            flex: 1,
            width,
            height: height - 108,
            backgroundColor: color.transparent,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            overflow: 'hidden'
          } : {
            flex: 1,
            width,
            height: height - 108,
            backgroundColor: color.transparent,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            overflow: 'hidden'
          }
        ]}
      >
        <ReelsSingle item={item} ref={ReelSingleRef => (mediaRefs.current[item?.id] = ReelSingleRef)} />

        <LinearGradient
          colors={['transparent', theme == 'dark' ? color.black : color.labelColor]}
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
            <UserInfo user={item?.user?.id} />

            {
              item?.description != '' &&
              <Text
                style={{
                  color: color.white,
                  fontSize: 16
                }}
              >
                {item?.description}
              </Text>
            }
          </View>

          {/* CONTROLS */}
          {
            userProfile &&
            <View
              style={{
                marginVertical: 30,
                position: 'absolute',
                right: 0,
                bottom: 0,
                margin: 20
              }}
            >
              <UserAvatar user={item?.user?.id} />

              <View
                style={{
                  paddingVertical: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  marginBottom: 50
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
          }
        </LinearGradient>
      </ImageBackground>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.transparent
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
            itemVisiblePercentThreshold: 95
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setReelsLimit(10)
                onRefresh()
              }}
            />
          }
          onEndReached={() => {
            if (reels?.length <= 10) return
            setReelsLimit(reelsLimit + 3)
            getReels()
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Reels

// for reels