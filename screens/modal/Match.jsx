import React from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { LinearGradient } from 'expo-linear-gradient'

import color from '../../style/color'

import { useFonts } from 'expo-font'

import { Glitch } from 'rn-glitch-effect'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const Match = () => {
  const navigation = useNavigation()
  const { params } = useRoute()

  const { userSwiped } = params

  const [loaded] = useFonts({
    logo: require("../../assets/fonts/Pacifico/Pacifico-Regular.ttf"),
    text: require("../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <ImageBackground
      style={{
        flex: 1,
      }}
      source={{ uri: userSwiped?.photoURL }}
    >
      <LinearGradient
        colors={['transparent', color.lightText]}
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "space-between"
        }}
      >
        <View
          style={{
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: color.lightGreen,
              textAlign: "center",
              marginTop: 300,
              fontSize: 30,
              textTransform: "uppercase",
              fontFamily: "text"
            }}
          >
            It's a
          </Text>
          <Glitch
            text={'MATCH'}
            mainColor={color.lightGreen}
            shadowColor={color.red}
            glitchDuration={2000}
            glitchAmplitude={10}
            repeatDelay={10}
            textStyle={{
              color: color.lightGreen,
              fontSize: 120,
              fontFamily: "logo"
            }}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: 100
          }}
        >
          <Text
            style={{
              fontFamily: "text",
              color: color.white,
              fontSize: 16
            }}
          >
            <Text
              style={{
                textTransform: "capitalize"
              }}
            >
              {userSwiped?.displayName + " "}
            </Text>
            likes you
          </Text>
          <MaterialCommunityIcons name='heart' size={30} color={color.lightGreen} />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
            navigation.navigate("Chat")
          }}
          style={{
            backgroundColor: color.white,
            borderRadius: 12,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20
          }}>
          <Text
            style={{
              color: color.dark,
              fontSize: 20,
              fontFamily: "text",
              color: color.lightText
            }}
          >
            Say hi to
            <Text
              style={{
                textTransform: "capitalize"
              }}
            >
              {" " + userSwiped?.displayName}
            </Text>
          </Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
              navigation.navigate("Match")
            }}
            style={{
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20
            }}
          >
            <Text
              style={{
                color: color.white,
                fontFamily: "text",
                fontSize: 16,
                textTransform: "uppercase"
              }}
            >
              Keep Swiping
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default Match