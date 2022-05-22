import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native'
import color from '../../style/color'
import Bar from '../../components/StatusBar'
import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import MyReels from './screens/MyReels'

const { width, height } = Dimensions.get('window')
const Profile = () => {
  const navigation = useNavigation()
  const { userProfile } = useAuth()

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar color={'dark'} />
      <Header showBack showTitle title='Profile' showAratar />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 20
        }}
      >
        <Image
          source={{ uri: userProfile?.photoURL }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 100
          }}
        />

        <View
          style={{
            flex: 1,
            paddingLeft: 20,
            justifyContent: 'center'
          }}
        >
          {
            userProfile?.username &&
            <Text
              style={{
                color: color.dark,
                fontFamily: 'boldText',
                fontSize: 20
              }}
            >
              {userProfile?.username}
            </Text>
          }
          <Text
            style={{
              fontFamily: 'text'
            }}
          >
            {userProfile?.displayName}
          </Text>

        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: color.borderColor,
            borderRadius: 50,
            height: 50,
            width: 50,
          }}
        >
          <FontAwesome name="edit" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginHorizontal: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: color.black
            }}
          >
            16
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.lightText,
              marginLeft: 5
            }}
          >
            Following
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginHorizontal: 20
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: color.black
            }}
          >
            12
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.lightText,
              marginLeft: 5
            }}
          >
            Followers
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: color.black
            }}
          >
            55
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.lightText,
              marginLeft: 5
            }}
          >
            Likes
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 20
        }}
      >
        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: color.dark
          }}
        >
          {userProfile?.about}
        </Text>
      </View>

      <MyReels />
    </SafeAreaView>
  )
}

export default Profile