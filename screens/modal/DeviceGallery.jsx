import { View, Text } from 'react-native'
import React from 'react'

import { GalleryProvider, Gallery } from 'expo-media-gallery'
import Header from '../../components/Header'
import color from '../../style/color'

const DeviceGallery = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <GalleryProvider>
        <Header showBack showTitle title='Select Media' />
        <Gallery
          rules={{
            selectionLimit: 10
          }}
        />
      </GalleryProvider>
    </View>
  )
}

export default DeviceGallery