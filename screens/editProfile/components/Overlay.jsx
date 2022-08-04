import { Text } from 'react-native'
import React, { useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import { BlurView } from 'expo-blur'
import { useFonts } from 'expo-font'

import LoadingIndicator from '../../../components/LoadingIndicator'
import color from '../../../style/color'
import { useNavigation } from '@react-navigation/native'

const Overlay = () => {
  const { theme, overlay } = useAuth()
  const navigation = useNavigation()

  useEffect(() => {
    if (!overlay) navigation.goBack()
  }, [overlay])

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <BlurView
      intensity={100}
      tint={theme == 'dark' ? 'dark' : 'light'}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text
        style={{
          fontFamily: 'text',
          color: theme == 'dark' ? color.white : color.dark,
          marginBottom: 30,
          fontSize: 20,
          position: 'absolute',
          top: '40%'
        }}
      >
        Updating your profile
      </Text>

      <LoadingIndicator size={50} theme={theme} />
    </BlurView>
  )
}

export default Overlay