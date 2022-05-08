import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native'

import Header from '../../components/Header'

import color from '../../style/color'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import moment from 'moment'

import { useFonts } from 'expo-font'

const UserProfile = (params) => {
  const currentUser = params?.route?.params?.user

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
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
      <Header showBack showTitle title={currentUser?.displayName} />
      <ScrollView>
        <View
          style={{
            padding: 10
          }}
        >
          <Image
            style={{
              width: '100%',
              height: 400,
              borderRadius: 12
            }}
            source={{ uri: currentUser.photoURL }}
          />
        </View>

        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 10
          }}
        >
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
                color: color.dark,
                fontSize: 30,
                marginRight: 10
              }}
            >
              {currentUser?.displayName}
            </Text>
            <Text
              style={{
                color: color.dark,
                fontSize: 30
              }}
            >
              {currentUser?.age}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default UserProfile