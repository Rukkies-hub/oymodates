import React from 'react'

import { StatusBar } from 'expo-status-bar'

const Bar = ({ color }) => {
  return (
    <StatusBar style={color} />
  )
}

export default Bar