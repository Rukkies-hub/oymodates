import { View, SafeAreaView, Text } from 'react-native'
import React from 'react'

import Header from '../components/Header'
import ChatList from '../components/ChatList'

import useAuth from '../hooks/useAuth'

const ChatScreen = () => {
  const {
    user,
    userProfile,
    likes,
    setLikes
  } = useAuth()
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  )
}
export default ChatScreen