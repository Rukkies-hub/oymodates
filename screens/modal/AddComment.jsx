import React, { useState, useEffect } from 'react'
import {
  View,
  Platform,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text
} from 'react-native'

import color from '../../style/color'

import { useFonts } from 'expo-font'

import Comments from '../../components/Comments'
import NewComment from '../../components/NewComment'
import useAuth from '../../hooks/useAuth'

import { useNavigation, useIsFocused } from '@react-navigation/native'

import { Entypo } from '@expo/vector-icons'

import Bar from '../../components/StatusBar'

import * as NavigationBar from 'expo-navigation-bar'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const AddComment = params => {
  const { userProfile } = useAuth()
  const post = params?.route?.params?.post
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [commtsCount, setCommentsCount] = useState()

  useEffect(() => {
    (() => {
      onSnapshot(doc(db, 'posts', post?.id),
        doc => {
          setCommentsCount(doc?.data()?.commentsCount)
        })
    })()
  }, [])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Bar color='light' />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={{ uri: post?.mediaType == 'image' ? post?.media : post?.thumbnail }}
          blurRadius={100}
          style={{ flex: 1 }}
        >
          <View
            style={{
              marginTop: 30,
              height: 40,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Entypo name='chevron-left' size={24} color={color.white} />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: color.white,
                  marginRight: 5
                }}
              >
                {commtsCount}
              </Text>
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: color.white
                }}
              >
                {commtsCount == 1 ? 'Comment' : 'Comments'}
              </Text>
            </View>
          </View>

          <Comments post={post} />

          <NewComment post={post} />
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default AddComment