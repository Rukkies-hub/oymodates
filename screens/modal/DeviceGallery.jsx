import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Image, Dimensions, FlatList } from 'react-native'

import * as MediaLibrary from 'expo-media-library'

import * as ImagePicker from 'expo-image-picker'

import Header from '../../components/Header'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'

const window = Dimensions.get('window')

let width = (window.width / 2) - 5

const DeviceGallery = () => {
  const navigation = useNavigation()
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
  const [limit, setLimit] = useState(40)

  const loadGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    setHasGalleryPermission(status == 'granted')

    if (status == 'granted') {
      const userGalleryMedia = await MediaLibrary.getAssetsAsync({
        first: limit,
        sortBy: ['creationTime'],
        mediaType: ['photo', 'video'],
      })
      setGalleryItems(userGalleryMedia)
    }
  }

  useEffect(() =>
    loadGallery()
    , [limit])

  const loadMore = () => {
    setLimit(limit + 20)
    loadGallery()

    console.log('limit: ', limit)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showBack showTitle title='Select Media' />

      <FlatList
        data={galleryItems?.assets}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMore}
        numColumns={2}
        style={{
          paddingHorizontal: 10
        }}
        renderItem={({ item: asset }) => (
          <View
            key={asset?.id}
            style={{
              flex: 1,
              flexDirection: 'column',
              marginBottom: 5
            }}
          >
            <Pressable
              // onLongPress={}
              // onPress={() => console.log('asset: ', asset)}
            >
              <Image
                source={{ uri: asset?.uri }}
                style={{
                  width: width - 10,
                  height: width - 10
                }}
              />
            </Pressable>
          </View>
        )}
      />
    </View>
  )
}

export default DeviceGallery