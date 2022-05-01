import React from 'react'
import { StatusBar } from 'react-native'

import color from "../style/color"

const StatusBar = () => {
  return (
    <StatusBar
        animated={true}
        barStyle="dark-content"
        backgroundColor={color.white}
      />
  )
}

export default StatusBar