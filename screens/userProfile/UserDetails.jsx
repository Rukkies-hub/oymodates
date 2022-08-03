import React, { useState, useLayoutEffect } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import color from '../../style/color'
import Bar from '../../components/StatusBar'
import Header from '../../components/Header'

import { Feather, Fontisto, SimpleLineIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import useAuth from '../../hooks/useAuth'
import { BlurView } from 'expo-blur'

const UserDetails = ({ userProfile, user }) => {
  const { profiles, theme } = useAuth()
  const navigation = useNavigation()

  const [showMatch, setShowMatch] = useState(false)

  useLayoutEffect(() => {
    const needle = user?.id
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (userSwiped) setShowMatch(true)
  }, [user])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <ImageBackground
      source={!user?.photoURL ? require('../../assets/background2.jpg') : { uri: user?.photoURL }}
      blurRadius={50}
    >
      <LinearGradient
        colors={[color.transparent, theme == 'dark' ? color.black : color.white]}
        style={{
          paddingHorizontal: 10
        }}
      >
        <Bar color={theme == 'dark' ? 'light' : 'dark'} />

        <Header
          showBack
          showTitle
          title={user?.username}
          backgroundColor={color.transparent}
          showAratar={userProfile?.photoURL ? true : false}
          showNotification
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {
            user?.photoURL ?
              <TouchableOpacity
                onPress={() => navigation.navigate('ViewAvatar', { avatar: user?.photoURL })}
              >
                <Image
                  source={{ uri: user?.photoURL }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 100
                  }}
                />
              </TouchableOpacity> :
              <BlurView
                intensity={50}
                tint={theme == 'dark' ? 'dark' : 'light'}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <SimpleLineIcons name='user' size={30} color={theme == 'dark' ? color.white : color.dark} />
              </BlurView>
          }

          <View
            style={{
              flex: 1,
              paddingLeft: 20,
              justifyContent: 'center'
            }}
          >
            {
              user?.username && user?.username != '' &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: theme == 'light' ? color.dark : color.white,
                    fontFamily: 'boldText',
                    fontSize: 20
                  }}
                >
                  {user?.username}
                </Text>
              </View>
            }

            {
              user?.displayName != '' &&
              <Text
                style={{
                  fontFamily: 'text',
                  color: theme == 'light' ? color.lightText : color.white
                }}
              >
                {user?.displayName}
              </Text>
            }
          </View>
        </View>

        {
          user?.about != '' &&
          <View
            style={{
              marginTop: 20
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: theme == 'light' ? color.dark : color.white
              }}
            >
              {user?.about}
            </Text>
          </View>
        }

        {
          user?.passions && user?.passions?.length > 1 &&
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 10
            }}
          >
            {
              user?.passions?.map((passion, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      backgroundColor: theme == 'dark' ? color.faintBlack : color.faintWhite,
                      borderRadius: 100,
                      marginBottom: 10,
                      marginRight: 5
                    }}
                  >
                    <Text
                      style={{
                        color: theme == 'dark' ? color.white : color.lightText,
                        fontSize: 12,
                        fontFamily: 'text',
                        textTransform: 'capitalize'
                      }}
                    >
                      {passion}
                    </Text>
                  </View>
                )
              })
            }
          </View>
        }

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Feather name='home' size={14} color={theme == 'light' ? color.dark : color.white} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: 10
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              Lives in
            </Text>
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 16,
                color: theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              {user?.city}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Fontisto name='date' size={14} color={theme == 'light' ? color.dark : color.white} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: 10
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              Joined
            </Text>
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 16,
                color: theme == 'light' ? color.dark : color.white,
                marginLeft: 5
              }}
            >
              {user?.timestamp?.toDate().toDateString()}
            </Text>
          </View>
        </View>

        {
          user?.job != '' &&
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <Feather name='briefcase' size={14} color={theme == 'light' ? color.dark : color.white} />

            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: theme == 'light' ? color.dark : color.white,
                marginLeft: 10
              }}
            >
              {user?.job} {user?.job ? 'at' : null} {user?.company}
            </Text>
          </View>
        }
      </LinearGradient>
    </ImageBackground>
  )
}

export default UserDetails
// in use