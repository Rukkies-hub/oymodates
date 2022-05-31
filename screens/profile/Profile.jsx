import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native'
import color from '../../style/color'
import Bar from '../../components/StatusBar'
import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import MyReels from './screens/MyReels'
import { FontAwesome, Feather, Fontisto } from '@expo/vector-icons'

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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: color.dark,
                  fontFamily: 'boldText',
                  fontSize: 20
                }}
              >
                {userProfile?.username}
              </Text>
              <Text
                style={{
                  color: color.dark,
                  fontFamily: 'boldText',
                  fontSize: 20,
                  marginLeft: 10
                }}
              >
                {userProfile?.age}
              </Text>
            </View>
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
            marginRight: 20
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: color.black
            }}
          >
            {userProfile?.followersCount ? userProfile?.followersCount : '0'}
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
            {userProfile?.likesCount ? userProfile?.likesCount : '0'}
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

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Feather name='home' size={14} color={color.dark} />

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
              color: color.dark,
              marginLeft: 5
            }}
          >
            Lives in
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: color.dark,
              marginLeft: 5
            }}
          >
            {userProfile?.city}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Fontisto name="date" size={14} color={color.dark} />

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
              color: color.dark,
              marginLeft: 5
            }}
          >
            Joined
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: color.dark,
              marginLeft: 5
            }}
          >
            {userProfile?.timestamp?.toDate().toDateString()}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Feather name="briefcase" size={14} color={color.dark} />

        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: color.dark,
            marginLeft: 10
          }}
        >
          {userProfile?.job} at {userProfile?.company}
        </Text>
      </View>

      <MyReels />
    </SafeAreaView>
  )
}

export default Profile