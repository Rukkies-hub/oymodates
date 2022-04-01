import { SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useRef } from 'react'

import useAuth from "../hooks/useAuth"
import Bar from "./StatusBar"

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Swiper from "react-native-deck-swiper"

import home from "../style/home"

const DUMY_DATA = [
  {
    id: 1,
    username: "rukkiecodes",
    occupation: "Software developer",
    age: "27",
    avatar: "https://vuesax.com/foto5.png"
  },
  {
    id: 2,
    username: "rukkiecodes2",
    occupation: "Software developer",
    age: "27",
    avatar: "https://vuesax.com/foto6.png"
  },
  {
    id: 3,
    username: "rukkiecodes3",
    occupation: "Software developer",
    age: "27",
    avatar: "https://vuesax.com/foto1.png"
  },
]

const HomeScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth()
  const swipeRef = useRef(null)

  return (
    <SafeAreaView style={home.container}>
      <Bar />
      <View style={home.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Text>Oymo</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <SimpleLineIcons name="bubble" color="rgba(0,0,0,0.6)" size={20} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: -6 }}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={DUMY_DATA}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={() => {
            console.log("Swipe PASS")
          }}
          onSwipedRight={() => {
            console.log("Swipe MATCH")
          }}
          backgroundColor={"#4fd0e9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red"
                }
              }
            },
            right: {
              title: "MATH",
              style: {
                label: {
                  color: "#4ded30"
                }
              }
            }
          }}
          renderCard={card => (
            <View key={card.id} style={{
              backgroundColor: "#fff",
              height: 500,
              width: "100%",
              borderRadius: 24,
              position: "relative"
            }}>
              <Image style={{
                flex: 1,
                width: "100%",
                height: "100%",
                borderRadius: 24,
                position: "absolute",
                top: 0,
                left: 0
              }} source={{ uri: card.avatar }} />

              <View style={{
                backgroundColor: "#fff",
                width: "100%", height: 60,
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                borderBottomRightRadius: 24,
                borderBottomLeftRadius: 24,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,

                elevation: 7,
              }}>
                <View>
                  <Text style={{ fontSize: 20, fontWeight: "600" }}>{card.username}</Text>
                  <Text>{card.occupation}</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>{card.age}</Text>
              </View>
            </View>
          )}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            width: 60,
            height: 60,
            backgroundColor: "rgba(255,71,87, 0.2)"
          }}>
          <MaterialCommunityIcons name="close" color="#FF4757" size={32} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            width: 60,
            height: 60,
            backgroundColor: "rgba(70,201,58, 0.2)"
          }}>
          <MaterialCommunityIcons name="heart" color="#46C93A" size={32} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen