import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'

import Header from '../components/Header'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

const Notifications = () => {
  const { userProfile } = useAuth()

  return (
    <SafeAreaView
      style={{
        backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
        flex: 1
      }}
    >
      <Header showBack showTitle title='Notification' showAratar />
      <Text
        style={{
          color: userProfile?.appMode == 'light' ? color.dark : color.white
        }}
      >
        Notifications
      </Text>
    </SafeAreaView>
  )
}

export default Notifications