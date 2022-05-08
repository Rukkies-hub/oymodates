import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'

import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'
import color from '../../style/color'


const DeviceGallery = () => {
  const { galleryItems } = useAuth()

  console.log(galleryItems)

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showBack showTitle title='Select Media' />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        {
          galleryItems.map(({ item, index }) => (
            <TouchableOpacity
              // key={item.id}
            >
              <Text>{ JSON.stringify(item) }</Text>
              {/* <Image
                source={{ uri: item.uri }}
                style={{
                  width: 100,
                  height: 100
                }}
              /> */}
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  )
}

export default DeviceGallery