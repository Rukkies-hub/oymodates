import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useNavigation } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'

const Header = ({ showAratar, showLogo, showTitle, title }) => {
  const navigation = useNavigation()
  const { user } = useAuth()

  // console.log(user)

  const [loaded] = useFonts({
    logo: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        width: '100%'
      }}
    >
      <View
        style={{
          backgroundColor: color.white,
          height: 50,
          marginTop: 40,
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {
          showLogo &&
          <Text
            style={{
              fontFamily: 'logo',
              fontSize: 25,
              margin: 0,
              marginTop: -10
            }}
          >
            Oymo
          </Text>
        }

        {
          showTitle &&
          <Text
            style={{
              fontFamily: 'text'
            }}
          >
            {title}
          </Text>
        }

        {
          showAratar &&
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateModal')}
          >
            {
              user.photoURL ?
                <Image
                  source={{ uri: user.photoURL }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50
                  }}
                />
                :
                <MaterialCommunityIcons name='account-circle-outline' size={28} color={color.lightText} />
            }
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default Header