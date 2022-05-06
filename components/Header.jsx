import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'

const Header = ({
  showAratar,
  showLogo,
  showTitle,
  title,
  showBack,
  showMatchAvatar,
  matchAvatar,
  showPhone,
  showVideo,
  showPost,
  postDetails
}) => {
  const navigation = useNavigation()
  const { user, userProfile } = useAuth()

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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {
            showBack &&
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <FontAwesome5 name='chevron-left' size={20} color={color.dark} />
            </TouchableOpacity>
          }
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
            showMatchAvatar &&
            <Image
              source={{ uri: matchAvatar }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                marginRight: 10
              }}
            />
          }
          {
            showTitle &&
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 18,
                textTransform: 'capitalize',
                color: color.dark
              }}
            >
              {title}
            </Text>
          }
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          {
            showPhone &&
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <FontAwesome5 name='phone' color={color.lightText} size={16} />
            </TouchableOpacity>
          }

          {
            showVideo &&
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FontAwesome5 name='video' color={color.lightText} size={16} />
            </TouchableOpacity>
          }

          {
            showPost &&
            <TouchableOpacity
              onPress={() => alert(postDetails.caption)}
              style={{
                backgroundColor: color.blue,
                borderRadius: 12,
                width: 60,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.white,
                  fontSize: 16
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          }

          {
            showAratar &&
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdateModal')}
            >
              {
                user.photoURL ?
                  <Image
                    source={{ uri: userProfile?.photoURL || user.photoURL }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50
                    }}
                  />
                  :
                  <FontAwesome5 name='user' size={16} color={color.lightText} />
              }
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

export default Header