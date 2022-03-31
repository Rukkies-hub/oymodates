import { StatusBar } from 'react-native'
import React from 'react'

import colors from "../style/color"

export default function Bar() {
  return (
    <StatusBar
        animated={true}
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
  )
}