import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import Header from '../../components/Header'
import Bar from '../../components/StatusBar'
import color from '../../style/color'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import useAuth from '../../hooks/useAuth'

import AppTheme from './AppTheme'
import AppLayout from './AppLayout'


const AccountSettings = () => {
  const { user, userProfile } = useAuth()

  const lightMode = () => updateDoc(doc(db, 'users', user?.uid), { theme: 'light' })

  const darkMode = () => updateDoc(doc(db, 'users', user?.uid), { theme: 'dark' })

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

      <Header showBack showTitle title='Account settings' showAratar />

      <AppTheme />
      <AppLayout />
    </SafeAreaView>
  )
}

export default AccountSettings