import React from 'react'
import { View } from 'react-native'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'

import ProfileDetails from './ProfileDetails'
import MyReels from './MyReels'

const Profile = () => {
  const { user, userProfile } = useAuth()

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

      <MyReels userProfile={userProfile} />
    </View>
  )
}

export default Profile