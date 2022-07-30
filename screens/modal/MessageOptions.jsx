import React, { useEffect } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import color from '../../style/color'

import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { useNavigation, useRoute } from '@react-navigation/native'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { deleteObject, getStorage, ref } from 'firebase/storage'

const MessageOptions = () => {
  const { messages, matchDetails } = useRoute().params
  const {
    userProfile,
    setMessageReply,
    theme
  } = useAuth()
  const navigation = useNavigation()

  const storage = getStorage()

  const deleteMessage = async () => {
    if (messages?.mediaLink) {
      const mediaRef = ref(storage, messages?.mediaLink)

      deleteObject(mediaRef)
        .then(async () => {
          await deleteDoc(doc(db, 'matches', matchDetails?.id, 'messages', messages?.id))
            .then(() => navigation.goBack())
        })
    } else {
      navigation.goBack()
      await deleteDoc(doc(db, 'matches', matchDetails?.id, 'messages', messages?.id))
    }
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      intensity={100}
      style={{
        flex: 1,
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
          minWidth: Dimensions.get('window').width,
          backgroundColor: theme == 'dark' ? color.black : color.white,
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
            setMessageReply(messages)
          }}
          activeOpacity={0.5}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme == 'light' ? color.offWhite : theme == 'dark' ? color.dark : color.black,
            borderRadius: 12
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: theme == 'light' ? color.dark : color.white
            }}
          >
            Reply
          </Text>
        </TouchableOpacity>

        {
          messages?.userId == userProfile?.id &&
          <TouchableOpacity
            onPress={deleteMessage}
            activeOpacity={0.5}
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme == 'light' ? color.offWhite : theme == 'dark' ? color.dark : color.black,
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
        }
      </View>
    </View>
  )
}

export default MessageOptions
// in use