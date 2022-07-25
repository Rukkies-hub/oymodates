import React from 'react'
import { View } from 'react-native'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'

import ProfileDetails from './ProfileDetails'
import MyReels from './MyReels'
import { useIsFocused, useNavigation } from '@react-navigation/native'

import * as NavigationBar from 'expo-navigation-bar'

const Profile = () => {
  const { user, userProfile } = useAuth()
  const focus = useIsFocused()
  const navigation = useNavigation()

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
      <>
        {
          userProfile && user &&
          <>
            <ProfileDetails userProfile={userProfile} user={user} />

            <MyReels userProfile={userProfile} />
          </>
        }
      </>
    </View>
  )
}

export default Profile
// in use