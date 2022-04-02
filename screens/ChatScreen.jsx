import { View, SafeAreaView, Text } from 'react-native'
import React from 'react'

import Header from '../components/Header'
import ChatList from '../components/ChatList'

const ChatScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  )
}
export default ChatScreen