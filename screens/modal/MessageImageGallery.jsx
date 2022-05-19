import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Image, Dimensions, FlatList } from 'react-native'

import * as MediaLibrary from 'expo-media-library'

import * as ImagePicker from 'expo-image-picker'

import Header from '../../components/Header'
import color from '../../style/color'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import useAuth from '../../hooks/useAuth'

const window = Dimensions.get('window')

let width = (window.width / 2) - 5

const MessageImageGallery = () => {
  const { assetsList, setAssetsList } = useAuth()
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
        mediaType: ['photo'],
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
      <Header
        showBack
        showTitle
        title='Select Image'
        showMessageImageGallerySelect
      />

      <FlatList
        data={galleryItems?.assets}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMore}
        numColumns={2}
        style={{
          paddingHorizontal: 5
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
              onPress={() => {
                if (assetsList?.includes(asset))
                  setAssetsList(assetsList.filter(item => item !== asset))
                else if (assetsList.length <= 4)
                  setAssetsList(oldArray => [...oldArray, asset])
              }}
              style={{
                position: 'relative'
              }}
            >
              <Image
                source={{ uri: asset?.uri }}
                style={{
                  width: width - 5,
                  height: width - 5
                }}
              />
              {
                assetsList?.includes(asset) &&
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: color.faintBlack
                  }}
                >
                  <MaterialCommunityIcons name='check' size={50} color={color.white} />
                </View>
              }
            </Pressable>
          </View>
        )}
      />
    </View>
  )
}

export default MessageImageGallery