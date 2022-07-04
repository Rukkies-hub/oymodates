import React, { useRef, useState } from 'react'
import { Text, TouchableOpacity, Dimensions, Image, View } from 'react-native'

import RBSheet from 'react-native-raw-bottom-sheet'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

const { width, height } = Dimensions.get('window')

import { FlatGrid } from 'react-native-super-grid'

const backgrounds = [
  {
    id: 1,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F1.jpg?alt=media&token=4e45830d-55f4-46a1-9cce-d219a3d6cbd5'
  },
  {
    id: 2,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F2.jpg?alt=media&token=624d9fd1-0246-4bb9-a76e-b2aa6d5b63d2'
  },
  {
    id: 3,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F3.jpg?alt=media&token=7b26caf2-00dd-40ad-85f5-ff35ef756e68'
  },
  {
    id: 4,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F4.jpg?alt=media&token=d4adb39b-5f76-40f1-9f43-8710f042039d'
  },
  {
    id: 5,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F5.jpg?alt=media&token=c081e96e-16c9-4add-838a-2cd868e336ea'
  },
  {
    id: 6,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F6.jpg?alt=media&token=c6332638-3b54-4e5e-9af2-3da93352298c'
  },
  {
    id: 7,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F7.jpg?alt=media&token=15d27711-82b3-43ed-9b11-2dfa36d126ff'
  },
  {
    id: 8,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F8.jpg?alt=media&token=881e251b-b7c5-4700-ae7c-9a76f224d795'
  },
  {
    id: 9,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F9.jpg?alt=media&token=7836bcf0-b749-4dfa-ae4c-f47ebb94e113'
  },
  {
    id: 10,
    image: 'https://firebasestorage.googleapis.com/v0/b/oymodates-38e12.appspot.com/o/chatBackground%2F10.jpg?alt=media&token=8cd9a766-9f77-4f4d-9c0f-9b0e213f46d5'
  },
]

const MessageSettings = props => {
  const { userProfile, setChatTheme } = useAuth()
  const refMessageSettingsSheet = useRef()

  const matchDetails = props?.matchDetails
  const iconColor = props?.iconColor

  const setChatBackground = async background => {
    await updateDoc(doc(db, 'matches', matchDetails?.id), {
      chatTheme: background?.image,
      chatThemeIndex: background?.id,
    })
    refMessageSettingsSheet?.current?.close()
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <>
      <TouchableOpacity
        onPress={() => refMessageSettingsSheet?.current?.open()}
        style={{
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <MaterialCommunityIcons name='dots-vertical' size={24} color={iconColor ? iconColor : userProfile?.theme == 'light' ? color.lightText : color.white} />
      </TouchableOpacity>

      <RBSheet
        openDuration={300}
        closeDuration={300}
        ref={refMessageSettingsSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={(height / 2) + 300}
        customStyles={{
          wrapper: {
            backgroundColor: color.faintBlack
          },
          container: {
            backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          },
          draggableIcon: {
            backgroundColor: userProfile?.theme == 'light' ? color.black : color.white
          }
        }}
      >
        <View
          style={{
            marginHorizontal: 10
          }}
        >
          <Text
            style={{
              color: userProfile?.theme == 'light' ? color.dark : color.white,
              fontFamily: 'text'
            }}
          >
            Theme
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <FlatGrid
              data={backgrounds}
              itemDimension={50}
              renderItem={({ item: background }) => (
                <TouchableOpacity onPress={() => setChatBackground(background)}>
                  <Image
                    source={{ uri: background.image }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 100
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </RBSheet>
    </>
  )
}

export default MessageSettings