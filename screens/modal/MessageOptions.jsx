import React from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import color from '../../style/color'

import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'

const MessageOptions = (props) => {
  const messages = props?.route?.params?.messages
  const {
    userProfile,
    setMessageReply
  } = useAuth()
  const navigation = useNavigation()

  // console.log('messages: ', messages)

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      intensity={100}
      style={{
        flex: 1,
        // backgroundColor: userProfile?.appMode == 'light' ? color.lightBorderColor : color.borderColor,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          minWidth: Dimensions.get('window').width,
          backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.black : color.dark,
          padding: 20,
          borderRadius: 20
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setMessageReply(messages)
            navigation.goBack()
          }}
          activeOpacity={0.5}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.dark : color.black,
            borderRadius: 12
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          >
            Reply
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.dark : color.black,
            borderRadius: 12,
            marginTop: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          >
            React to message
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.dark : color.black,
            borderRadius: 12,
            marginTop: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.appMode == 'light' ? color.dark : color.white
            }}
          >
            Star message
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.dark : color.black,
            borderRadius: 12,
            marginTop: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: color.red
            }}
          >
            Delete message
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MessageOptions