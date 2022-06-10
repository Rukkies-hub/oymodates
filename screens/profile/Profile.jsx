import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native'
import color from '../../style/color'
import Bar from '../../components/StatusBar'
import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import MyReels from './MyReels'
import { FontAwesome, Feather, Fontisto, MaterialIcons } from '@expo/vector-icons'

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
        backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
      }}
    >
      <Bar color={userProfile?.appMode == 'light' ? 'dark' : 'light'} />
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
                  color: userProfile?.appMode == 'light' ? color.dark : color.white,
                  fontFamily: 'boldText',
                  fontSize: 20
                }}
              >
                {userProfile?.username}
              </Text>
            </View>
          }
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.appMode == 'light' ? color.lightText : color.white
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
            borderColor: userProfile?.appMode == 'light' ? color.borderColor : color.lightBorderColor,
            borderRadius: 50,
            height: 50,
            width: 50,
          }}
        >
          <FontAwesome name="edit" size={20} color={userProfile?.appMode == 'light' ? color.dark : color.white} />
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
              color: userProfile?.appMode == 'light' ? color.black : color.white
            }}
          >
            {userProfile?.followersCount ? userProfile?.followersCount : '0'}
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.appMode == 'light' ? color.lightText : color.white,
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
              color: userProfile?.appMode == 'light' ? color.black : color.white
            }}
          >
            {userProfile?.likesCount ? userProfile?.likesCount : '0'}
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.appMode == 'light' ? color.lightText : color.white,
              marginLeft: 5
            }}
          >
            Likes
          </Text>
        </View>
      </View>

      {
        userProfile?.about &&
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
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          >
            {userProfile?.about}
          </Text>
        </View>
      }

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Feather name='home' size={14} color={userProfile?.appMode == 'light' ? color.dark : color.white} />

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
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              marginLeft: 5
            }}
          >
            Lives in
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
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
        <MaterialIcons name="cake" size={14} color={userProfile?.appMode == 'light' ? color.dark : color.white} />

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
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              marginLeft: 5
            }}
          >
            Birthday
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              marginLeft: 5
            }}
          >
            {userProfile?.ageDate}
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
        <Fontisto name="date" size={14} color={userProfile?.appMode == 'light' ? color.dark : color.white} />

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
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              marginLeft: 5
            }}
          >
            Joined
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
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
        <Feather name="briefcase" size={14} color={userProfile?.appMode == 'light' ? color.dark : color.white} />

        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: userProfile?.appMode == 'light' ? color.dark : color.white,
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