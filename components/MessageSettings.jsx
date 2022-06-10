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

const backgrounds = [
  {
    id: 1,
    image: require('../assets/chat/1.jpg')
  },
  {
    id: 2,
    image: require('../assets/chat/2.jpg')
  },
  {
    id: 3,
    image: require('../assets/chat/3.jpg')
  },
  {
    id: 4,
    image: require('../assets/chat/4.jpg')
  },
  {
    id: 5,
    image: require('../assets/chat/5.jpg')
  },
  {
    id: 6,
    image: require('../assets/chat/6.jpg')
  },
  {
    id: 7,
    image: require('../assets/chat/7.jpg')
  },
  {
    id: 8,
    image: require('../assets/chat/8.jpg')
  },
  {
    id: 9,
    image: require('../assets/chat/9.jpg')
  },
  {
    id: 10,
    image: require('../assets/chat/10.jpg')
  },
]

const MessageSettings = (props) => {
  const { userProfile, setChatTheme } = useAuth()
  const refMessageSettingsSheet = useRef()

  const matchDetails = props?.matchDetails

  const setChatBackground = async background => {
    await updateDoc(doc(db, 'matches', matchDetails?.id), {
      chatTheme: background?.id
    })
    setChatTheme(background?.id)
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <>
      <TouchableOpacity
        onPress={() => refMessageSettingsSheet.current.open()}
        style={{
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={24} color={userProfile?.appMode == 'light' ? color.lightText : color.white} />
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
            backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          },
          draggableIcon: {
            backgroundColor: userProfile?.appMode == 'light' ? color.black : color.white
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
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              fontFamily: 'text'
            }}
          >
            Chat Theme
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
            {
              backgrounds.map((background, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setChatBackground(background)}
                  style={{
                    margin: 5
                  }}
                >
                  <Image
                    source={background.image}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 100
                    }}
                  />
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
      </RBSheet>
    </>
  )
}

export default MessageSettings