import { View, Text } from 'react-native'
import React from 'react'

import { MotiView } from '@motify/components'
import color from '../style/color'

const LoadingIndicator = ({ size, theme }) => {
  return (
    <MotiView
      from={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 0,
        shadowOpacity: 0.5
      }}
      animate={{
        width: size + 20,
        height: size + 20,
        borderRadius: (size + 20) / 2,
        borderWidth: size / 10,
        shadowOpacity: 1
      }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size / 10,
        borderColor: theme == 'dark' ? color.white : color.black,
        shadowColor: theme == 'dark' ? color.white : color.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10
      }}
    />
  )
}

export default LoadingIndicator