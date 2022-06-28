import React from 'react'
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

import { useNavigation } from '@react-navigation/native'

import { Entypo } from '@expo/vector-icons'

const AddComment = params => {
  const { userProfile } = useAuth()
  const post = params?.route?.params?.post
  const navigation = useNavigation()

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={{ uri: post?.mediaType == 'image' ? post?.media : userProfile?.photoURL }}
          blurRadius={50}
          style={{ flex: 1 }}
        >
          <View
            style={{
              marginTop: 30,
              height: 40,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
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

            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: color.white
              }}
            >
              Comment
            </Text>
          </View>

          <Comments post={post} />

          <NewComment post={post} />
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default AddComment