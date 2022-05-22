import React from 'react'
import { StatusBar } from 'expo-status-bar'

export default function Bar (props) {
  return <StatusBar style={props.color} />
}