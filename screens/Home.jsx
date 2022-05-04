import React, { useState } from 'react'
import { View, Text, Button, SafeAreaView } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'

import Bar from '../components/StatusBar'
import color from '../style/color'

import Header from '../components/Header'

import Swiper from 'react-native-deck-swiper'

const Home = () => {
  const navigation = useNavigation()
  const { user, logout } = useAuth()

  const [profiles, setProfiles] = useState([])
  const [stackSize, setStackSize] = useState(1)

  return (
    <SafeAreaView
      style={{
        backgroundColor: color.white,
        flex: 1
      }}
    >
      <Bar />
      <Header showLogo showAratar />

      <View>
        {/* <Swiper
          cards={profiles}
          containerStyle={{
            backgroundColor: color.transparent,
            marginTop: -20
          }}
          cardIndex={0}
          stackSize={stackSize}
          verticalSwipe={true}
          animateCardOpacity={true}
          backgroundColor={color.transparent}
          cardHorizontalMargin={2}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: color.red,
                  fontFamily: "text"
                }
              }
            },

            bottom: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: color.red,
                  fontFamily: "text"
                }
              }
            },

            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: color.lightGreen,
                  fontFamily: "text"
                }
              }
            }
          }}

          renderCard={card => (
            <View
              style={{
                backgroundColor: color.white,
                height: 698,
                marginTop: -30,
                width: "100%",
                borderRadius: 10,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Image
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                }}
                source={{ uri: card?.avatar[0] }}
              />
            </View>
          )}
        /> */}
      </View>
    </SafeAreaView>
  )
}

export default Home