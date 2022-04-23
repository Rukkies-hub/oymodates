import React from "react"

import { SafeAreaView } from "react-native"

import Header from "../components/Header"

import ChatList from "../components/ChatList"

import color from "../style/color"

import Bar from "./StatusBar"

export default () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <Bar />
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  )
}