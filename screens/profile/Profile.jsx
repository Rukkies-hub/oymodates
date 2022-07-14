import React from 'react'
import { View } from 'react-native'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { useIsFocused, useNavigation } from '@react-navigation/native'


import * as NavigationBar from 'expo-navigation-bar'

import ProfileDetails from './ProfileDetails'
import ProfileTabs from './ProfileTabs'


const Profile = () => {
  const navigation = useNavigation()
  const focus = useIsFocused()
  const { user, userProfile } = useAuth()

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
      <ProfileDetails userProfile={userProfile} user={user} />

      <ProfileTabs userProfile={userProfile} />
    </View>
  )
}

export default Profile