import { useFonts } from 'expo-font'
import React, { useState } from 'react'
import { View, Text, SafeAreaView, FlatList, Pressable, Image, TouchableOpacity } from 'react-native'

import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'
import color from '../../style/color'

import { AntDesign, MaterialCommunityIcons, Fontisto, Feather, Ionicons } from '@expo/vector-icons'
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'

import { SwipeListView } from 'react-native-swipe-list-view'
import UserInfo from './components/UserInfo'
import UserAvatar from './components/UserAvatar'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Notifications = () => {
  const navigation = useNavigation()
  const { userProfile, notifications, user, setNotificationCount } = useAuth()

  const viewNotification = async notification => {
    if (!notification?.seen) {
      await updateDoc(doc(db, 'users', userProfile?.id, 'notifications', notification?.notification), {
        seen: true
      }).then(() => {
        if (notification?.activity == 'likes' || notification?.activity == 'comment likes') navigation.navigate('ViewReel', { reel: notification?.reel })
        else if (notification?.activity == 'comment' || notification?.activity == 'comments') navigation.navigate('ReelsComment', { item: notification?.reel })
        else if (notification?.activity == 'reply') navigation.navigate('ReelsComment', { item: notification?.reel })
      })
    } else {
      if (notification?.activity == 'likes' || notification?.activity == 'comment likes') navigation.navigate('ViewReel', { reel: notification?.reel })
      else if (notification?.activity == 'comment' || notification?.activity == 'comments') navigation.navigate('ReelsComment', { item: notification?.reel })
      else if (notification?.activity == 'reply') navigation.navigate('ReelsComment', { item: notification?.reel })
    }
  }

  const markAllAsRead = async () => {
    const snapshot = await getDocs(query(collection(db, 'users', userProfile?.id, 'notifications'), where('seen', '==', !false)))
    snapshot?.forEach(async allDoc => {
      await updateDoc(doc(db, 'users', userProfile?.id, 'notifications', allDoc?.id), {
        seen: !true
      })
    })
  }

  const clearAll = async () => {
    const snapshot = await getDocs(collection(db, 'users', userProfile?.id, 'notifications'))
    snapshot?.forEach(async allDoc => {
      await deleteDoc(doc(db, 'users', userProfile?.id, 'notifications', allDoc?.id), {
        seen: true
      })
    })
  }


  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey)
  }

  const deleteNotification = async item =>
    await deleteDoc(doc(db, 'users', userProfile?.id, 'notifications', item?.id))


  const markAsRead = async item => {
    if (item?.seen)
      await updateDoc(doc(db, 'users', userProfile?.id, 'notifications', item?.id), { seen: false })
    else
      await updateDoc(doc(db, 'users', userProfile?.id, 'notifications', item?.id), { seen: true })
  }

  const renderHiddenItem = ({ item }) => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
      }}
    >
      <TouchableOpacity
        onPress={() => markAsRead(item)}
        style={
          [{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 10,
            bottom: 0,
            width: 45,
            height: 45,
            borderRadius: 12,
          }, {
            backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
            right: 80,
          }]
        }
      >
        <Ionicons name='checkmark-done' size={24} color={item?.seen ? (userProfile?.theme == 'dark' ? color.white : color.dark) : color.blue} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteNotification(item)}
        style={
          [{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 10,
            bottom: 0,
            width: 45,
            height: 45,
            borderRadius: 12,
          }, {
            backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
            right: 20,
          }]
        }
      >
        <Feather name='trash-2' size={20} color={color.red} />
      </TouchableOpacity>
    </View >
  )

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
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

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginVertical: 20,
          paddingHorizontal: 10
        }}
      >
        {
          notifications.length >= 1 &&
          <>
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
            <TouchableOpacity
              onPress={clearAll}
              style={{
                backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
                height: 35,
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                marginLeft: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Feather name='trash-2' size={20} color={color.red} />
            </TouchableOpacity>
          </>
        }
      </View>

      <SwipeListView
        data={notifications}
        keyExtractor={item => item?.id}
        style={{
          flex: 1,
          paddingHorizontal: 10
        }}
        rightOpenValue={-140}
        previewRowKey={'0'}
        previewOpenValue={-80}
        previewOpenDelay={3000}
        renderHiddenItem={renderHiddenItem}
        onRowDidOpen={onRowDidOpen}
        renderItem={({ item: notification }) => {
          return (
            <TouchableOpacity
              onPress={() => viewNotification(notification)}
              activeOpacity={1}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: notification?.seen == false ? (userProfile?.theme == 'dark' ? color.dark : color.offWhite) : userProfile?.theme == 'dark' ? color.black : color.white
              }}
            >
              <View
                style={{
                  position: 'relative',
                  marginRight: 10
                }}
              >
                <UserAvatar user={notification?.user?.id} />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: -4,
                    backgroundColor: notification?.activity == 'likes' || notification?.activity == 'comment likes' ? color.red : color.green,
                    borderRadius: 50,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {
                    notification?.activity == 'likes' || notification?.activity == 'comment likes' ?
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
                  <UserInfo user={notification?.user?.id} />
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
// in use