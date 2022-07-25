import React, { useState, useLayoutEffect } from 'react'
import { View } from 'react-native'

import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'

import color from '../../style/color'
import { useFonts } from 'expo-font'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import useAuth from '../../hooks/useAuth'
import UserDetails from './UserDetails'
import * as NavigationBar from 'expo-navigation-bar'
import UserReels from './UserReels'

const UserProfile = () => {
  const { userProfile, setViewUser, viewUser } = useAuth()
  const { user: viewingUser } = useRoute().params
  const focus = useIsFocused()
  const navigation = useNavigation()

  const [user, setUser] = useState(null)

  useLayoutEffect(() => {
    (async () => {
      const user = await (await getDoc(doc(db, 'users', viewingUser?.id))).data()
      setUser(user)
      setViewUser(user)
    })()
  }, [])

  if (focus) {
    NavigationBar.setPositionAsync('absolute')
    NavigationBar.setBackgroundColorAsync(color.transparent)
  }

  navigation.addListener('blur', () => {
    NavigationBar.setPositionAsync('relative')
    NavigationBar.setBackgroundColorAsync(userProfile?.theme == 'dark' ? color.black : color.white)
    NavigationBar.setButtonStyleAsync(userProfile?.theme == 'dark' ? 'light' : 'dark')
  })

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      {
        viewUser &&
        <UserDetails userProfile={userProfile} user={user} />
      }

      {
        viewUser &&
        <UserReels userProfile={userProfile} />
      }
    </View>
  )
}

export default UserProfile
// in use