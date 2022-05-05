import React, { useEffect } from 'react'

import { View } from 'react-native'

import color from '../style/color'

import Header from '../components/Header'

import ChatList from '../components/ChatList'
import useAuth from '../hooks/useAuth'

const Chat = () => {
  const { getUserProfile, user } = useAuth()

  useEffect(() => {
    getUserProfile(user)
  }, [])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header title='Chat' showTitle showAratar />
      <ChatList />
    </View>
  )
}

export default Chat