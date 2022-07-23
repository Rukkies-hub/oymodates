import { useFonts } from 'expo-font'
import React, { useState } from 'react'
import { View, Text, SafeAreaView, FlatList, Pressable, Image, TouchableOpacity } from 'react-native'

import Header from '../components/Header'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { AntDesign, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons'
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useNavigation } from '@react-navigation/native'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Notifications = () => {
  const navigation = useNavigation()
  const { userProfile, notifications, user } = useAuth()

  const viewNotification = async notification => {
    if (!notification?.seen) {
      await updateDoc(doc(db, 'users', user?.uid, 'notifications', notification?.notification), {
        seen: true
      }).then(() => {
        if (notification?.activity == 'likes') navigation.navigate('ViewReel', { reel: notification?.reel })
        else if (notification?.activity == 'comment') navigation.navigate('ReelsComment', { item: notification?.reel })
        else if (notification?.activity == 'reply') navigation.navigate('ReelsComment', { item: notification?.reel })
      })
    } else {
      if (notification?.activity == 'likes') navigation.navigate('ViewReel', { reel: notification?.reel })
      else if (notification?.activity == 'comment') navigation.navigate('ReelsComment', { item: notification?.reel })
      else if (notification?.activity == 'reply') navigation.navigate('ReelsComment', { item: notification?.reel })
    }
  }

  const markAllAsRead = async () => {
    const snapshot = await getDocs(query(collection(db, 'users', user?.uid, 'notifications'), where('seen', '!=', false)))
    snapshot?.forEach(async allDoc => {
      await updateDoc(doc(db, 'users', user?.uid, 'notifications', allDoc?.id), {
        seen: true
      })
    })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
        flex: 1
      }}
    >
      <Header showBack showTitle title='Notifications' showAratar showNotification />

      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginVertical: 20
        }}
      >
        <TouchableOpacity
          onPress={markAllAsRead}
          style={{
            backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
            height: 35,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8
          }}
        >
          <Text
            style={{
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              fontFamily: 'text'
            }}
          >
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View> */}
      <FlatList
        data={notifications}
        keyExtractor={item => Math.random(item?.id)}
        style={{
          flex: 1,
          marginTop: 20,
          paddingHorizontal: 10
        }}
        renderItem={({ item: notification }) => {
          return (
            <TouchableOpacity
              onPress={() => viewNotification(notification)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: notification?.seen == false ? (userProfile?.theme == 'dark' ? color.dark : color.offWhite) : color.transparent
              }}
            >
              <View
                style={{
                  position: 'relative',
                  marginRight: 10
                }}
              >
                <Image
                  source={{ uri: notification?.user?.photoURL }}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: -4,
                    backgroundColor: notification?.activity == 'likes' ? color.red : color.green,
                    borderRadius: 50,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {
                    notification?.activity == 'likes' ?
                      <AntDesign name='heart' size={10} color={color.white} /> :
                      <Fontisto name='comment' size={10} color={color.white} />
                  }
                </View>
              </View>
              <View
                style={{
                  flex: 1
                }}
              >
                <View
                  style={{
                    flexDirection: 'row'
                  }}
                >
                  <Text
                    style={{
                      color: userProfile?.theme == 'light' ? color.dark : color.white,
                      fontFamily: 'text',
                      fontSize: 14
                    }}
                  >
                    {notification?.user?.username}
                  </Text>
                  <Text
                    style={{
                      color: userProfile?.theme == 'light' ? color.dark : color.white,
                      marginLeft: 6,
                      fontSize: 14
                    }}
                  >
                    {notification?.activity == 'likes' ? 'likes your post' : 'commented on your post'}
                  </Text>
                </View>
                <Text
                  style={{
                    color: color.red,
                    marginTop: 3
                  }}
                >
                  {notification?.timestamp?.toDate().toDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </SafeAreaView >
  )
}

export default Notifications