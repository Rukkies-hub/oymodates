import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions } from 'react-native'


import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import Header from '../components/Header'

import color from '../style/color'
import PostSingle from '../components/PostSingle'

const { width, height } = Dimensions.get('window')

const Reels = () => {
  const mediaRefs = useRef([])

  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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

  // useEffect(() =>
  //   onSnapshot(collection(db, 'reels'),
  //     snapshot =>
  //       setReels(
  //         snapshot.docs.map(doc => ({
  //           id: doc.id,
  //           ...doc.data()
  //         }))
  //       )
  //   )
  //   , [])

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={
          [
            {
              flex: 1,
              width,
              height: height - 108
            },
            index % 2 == 0 ? { backgroundColor: 'blue' } : { backgroundColor: 'red' }
          ]
        }
      >
        <PostSingle ref={PostSingleRef => (mediaRefs.current[item] = PostSingleRef)} />
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
      <Header showLogo showAratar />

      <View
        style={{
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        <FlatList
          data={array}
          windowSize={2}
          initialNumToRender={0}
          maxToRenderPerBatch={1}
          removeClippedSubviews
          viewabilityConfig={{
            itemVisiblePercentThreshold: 75
          }}
          renderItem={renderItem}
          pagingEnabled
          keyExtractor={item => item}
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