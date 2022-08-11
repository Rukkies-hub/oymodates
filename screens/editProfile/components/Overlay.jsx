import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import { BlurView } from 'expo-blur'
import { useFonts } from 'expo-font'

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
      intensity={10}
      tint={theme == 'dark' ? 'dark' : 'light'}
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
          minHeight: 40,
          width: '98%',
          borderRadius: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20
        }}
      >
        <Text
          style={{
            fontFamily: 'text',
            color: theme == 'dark' ? color.white : color.dark,
            fontSize: 20
          }}
        >
          Updating your profile
        </Text>
        <ActivityIndicator size='large' color={color.red} />
      </View>
    </BlurView>
  )
}

export default Overlay