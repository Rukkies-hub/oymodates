import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import color from '../../style/color'

import AutoHeightImage from 'react-native-auto-height-image'

import { useNavigation, useRoute } from '@react-navigation/native'

const ViewAvatar = () => {
  const { avatar } = useRoute().params
  const navigation = useNavigation()

  return (
    <View
      style={{
        backgroundColor: color.labelColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <AutoHeightImage
        source={{ uri: avatar }}
        width={Dimensions.get('window').width}
        resizeMode='cover'
      />
    </View>
  )
}

export default ViewAvatar
// in use