import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import color from '../../../style/color'
import useAuth from '../../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { Foundation } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const { width } = Dimensions.get('window')

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
})

const Gender = () => {
  const { theme, userProfile } = useAuth()
  const navigation = useNavigation()

  const [maleLoading, setMaleLoading] = useState(false)
  const [femaleLoading, setFemaleLoading] = useState(false)

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const maleGender = async () => {
    setMaleLoading(true)
    await updateDoc(doc(db, 'users', userProfile?.id), { gender: 'male' })
    setMaleLoading(false)
    schedulePushNotification()
    navigation.goBack()
  }

  const femaleGender = async () => {
    setFemaleLoading(true)
    await updateDoc(doc(db, 'users', userProfile?.id), { gender: 'female' })
    setFemaleLoading(false)
    schedulePushNotification()
    navigation.goBack()
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.faintBlack,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flex: 1,
          width: '100%'
        }}
      />

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: width,
          backgroundColor: theme == 'dark' ? color.black : color.white,
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}
      >
        <Text
          style={{
            color: color.red,
            fontFamily: 'boldText',
            fontSize: 30
          }}
        >
          Warning!!!
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontFamily: 'text',
            color: theme == 'dark' ? color.white : color.dark
          }}
        >
          You only have one chance to change this information
        </Text>

        <TouchableOpacity
          onPress={maleGender}
          style={{
            height: 50,
            backgroundColor: color.red,
            paddingHorizontal: 10,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10
          }}
        >
          {
            !maleLoading ?
              <>
                <Foundation name='male-symbol' size={24} color={color.white} />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    fontSize: 18,
                    marginLeft: 10
                  }}
                >
                  Male (Man)
                </Text>
              </> :
              <ActivityIndicator size='small' color={color.white} />
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={femaleGender}
          style={{
            height: 50,
            backgroundColor: color.darkBlue,
            paddingHorizontal: 10,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10
          }}
        >
          {
            !femaleLoading ?
              <>
                <Foundation name='female-symbol' size={24} color={color.white} />
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    fontSize: 18,
                    marginLeft: 10
                  }}
                >
                  Female (Woman)
                </Text>
              </> :
              <ActivityIndicator size='small' color={color.white} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

async function schedulePushNotification () {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Update successful",
      body: 'Your profile has been updated successfully'
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync () {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default Gender