import React, { useEffect } from 'react'

import { View, Image, Pressable, Text } from 'react-native'

import color from '../style/color'

import Header from '../components/Header'

import ChatList from '../components/ChatList'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'

const Chat = () => {
  const navigation = useNavigation()
  const { getUserProfile, user, pendingSwipes } = useAuth()

  useEffect(() => {
    getUserProfile(user)
  }, [])

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
      <Header title='Chat' showTitle showAratar />

      {
        pendingSwipes?.length > 0 &&
        <Pressable
          onPress={() => navigation.navigate('Likes')}
          style={{
            paddingHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <Image
            resizeMode='cover'
            blurRadius={100}
            source={{ uri: pendingSwipes[0].photoURL }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 50
            }}
          />

          <View
            style={{
              justifyContent: 'center',
              marginLeft: 10
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
                pendingSwipes[0].username ?
                  <Text
                    style={{
                      fontFamily: 'text',
                      fontSize: 18
                    }}
                  >
                    {pendingSwipes[0].username}
                  </Text> :
                  <Text>{pendingSwipes[0].displayName}</Text>
              }
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  borderRadius: 50,
                  backgroundColor: color.goldDark,
                  marginLeft: 10
                }}
              >
                <Text
                  style={{
                    fontFamily: 'text',
                    fontSize: 16,
                    color: color.white
                  }}
                >
                  Likes you
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontFamily: 'text',
                color: color.lightText
              }}
            >
              Recently active, match now!
            </Text>
          </View>
        </Pressable>
      }
      <ChatList />
    </View>
  )
}

export default Chat