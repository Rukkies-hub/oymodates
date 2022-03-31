import { View, Text, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'

import colors from "../style/color"

const Add = () => {
  return (
    <SafeAreaView>
      <StatusBar
        animated={true}
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <Text>Add</Text>
    </SafeAreaView>
  )
}
export default Add