import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import color from '../../style/color'

import AutoHeightImage from 'react-native-auto-height-image'

const ViewAvarar = (props) => {
  const avatar = props?.route?.params?.avatar

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
        width={Dimensions.get('window').width - 20}
        resizeMode='cover'
      />
    </View>
  )
}

export default ViewAvarar