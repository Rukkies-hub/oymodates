import React, { useLayoutEffect } from 'react'
import { View, SafeAreaView } from 'react-native'
import Header from '../components/Header'
import color from '../style/color'

import { useFonts } from 'expo-font'
import Posts from '../components/Posts'

import Bar from "../components/StatusBar"
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'

const Feeds = () => {
  const { user } = useAuth()
  const navigation = useNavigation()

  useLayoutEffect(() =>
    onSnapshot(doc(db, 'users', user.uid),
      snapshot => {
        if (!snapshot.exists()) navigation.navigate('Profile')
      })
    , [])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar />
      <Header showLogo showAratar showAdd />

      <Posts />
    </View>
  )
}

export default Feeds