import React, { useRef, useState } from 'react'

import { View, Text, SafeAreaView, FlatList, Image, Pressable, Dimensions } from 'react-native'

import Header from '../../components/Header'

import color from '../../style/color'

import useAuth from '../../hooks/useAuth'

const { width, height } = Dimensions.get('window')

const PreviewMessageImage = () => {
  const { assetsList } = useAuth()

  console.log('assetsList: ', assetsList)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showBack showTitle title='Preview image' />

      <FlatList
        horizontal
        data={assetsList}
        bounces={false}
        keyExtractor={(item, index) => index.toString()}
        style={{
          flex: 1
        }}
        renderItem={({ item: media }) => (
          <Pressable
            style={{
              flex: 1
            }}
          >
            <Image
              style={{
                width: width,
                height: width
              }}
              source={{
                uri: media?.uri,
              }}
              resizeMode='cover'
            />
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}

export default PreviewMessageImage