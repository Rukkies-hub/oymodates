import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions
} from 'react-native'
import React, { useState } from 'react'

import { WebView } from 'react-native-webview'

import color from "../style/color"
import { useFonts } from 'expo-font'

import { SwiperFlatList } from 'react-native-swiper-flatlist'

import { LinearGradient } from 'expo-linear-gradient'

const DATA = [
  {
    title: 'Unlimited likes',
    subTitle: "Send as much likes as you want",
    image: require("../assets/hearts.png")
  },
  {
    title: 'Like profiles around the world',
    subTitle: "Passport to anywhere!",
    image: require("../assets/location2.png")
  },
  {
    title: 'Control your profile',
    subTitle: "Limit what others can see",
    image: require("../assets/power-off.png")
  },
  {
    title: 'Unlimited rewinds',
    subTitle: "Go back and try again",
    image: require("../assets/undo.png")
  },
]

const { width, height } = Dimensions.get('window')
const ITEM_SIZE = width

import firebase from '../hooks/firebase'

import useAuth from '../hooks/useAuth'

const OymoGold = () => {
  const { user, userProfile } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState("")
  const [activeButton, setActiveButton] = useState("6")

  const handleResponse = data => {
    if (activeButton == "12") {
      let currentDate = new Date()
      let expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 12)
      if (data.title === "success") {
        setShowModal(false)
        setStatus("complete")

        firebase.firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            subscriptionPlans: "gold",
            duration: 12,
            payed: true,
            currentDate,
            expiryDate
          })
      } else if (data.title === "cancel") {
        setShowModal(false)
        setStatus("canceled")
        console.log("cancel: ", data)
      } else return
    }
    if (activeButton == "6") {
      let currentDate = new Date()
      let expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 6)
      if (data.title === "success") {
        setShowModal(false)
        setStatus("complete")

        firebase.firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            subscriptionPlans: "gold",
            duration: 6,
            payed: true,
            currentDate,
            expiryDate
          })
      } else if (data.title === "cancel") {
        setShowModal(false)
        setStatus("canceled")
        console.log("cancel: ", data)
      } else return
    }
    if (activeButton == "1") {
      let currentDate = new Date()
      let expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 1)
      if (data.title === "success") {
        setShowModal(false)
        setStatus("complete")

        firebase.firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            subscriptionPlans: "gold",
            duration: 1,
            payed: true,
            currentDate,
            expiryDate
          })
      } else if (data.title === "cancel") {
        setShowModal(false)
        setStatus("canceled")
        console.log("cancel: ", data)
      } else return
    }
  }

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf"),
    logo: require("../assets/fonts/Pacifico/Pacifico-Regular.ttf")
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white,
        justifyContent: "center",
        paddingHorizontal: 10
      }}
    >
      <View
        style={{
          borderRadius: 20,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "text",
              fontSize: 20,
              marginBottom: 30,
              color: color.goldDark
            }}
          >
            Get Oymo Gold
          </Text>

          <SwiperFlatList
            data={DATA}
            keyExtractor={(item, key) => key}
            autoplay
            autoplayDelay={2}
            autoplayLoop
            index={0}
            renderItem={({ item }) => (
              <View
                style={{
                  width: ITEM_SIZE,
                  minHeight: ITEM_SIZE / 2 + 50,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: 100,
                    height: 100
                  }}
                />

                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 18,
                    fontFamily: "text",
                    textTransform: "capitalize"
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  style={{
                    fontFamily: "text",
                    fontSize: 12
                  }}
                >
                  {item.subTitle}
                </Text>
              </View>
            )}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveButton("12")}
            style={{
              width: "33.3333333333%",
              borderWidth: 1,
              borderColor: activeButton == "12" ? color.goldDark : color.borderColor,
              minHeight: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "text",
                fontSize: 20,
                color: activeButton == "12" ? color.goldDark : color.dark
              }}
            >
              12
            </Text>

            <Text
              style={{
                fontFamily: "text",
                color: activeButton == "12" ? color.goldDark : color.dark
              }}
            >
              Months
            </Text>

            <Text
              style={{
                fontFamily: "text",
                marginTop: 15,
                color: activeButton == "12" ? color.goldDark : color.dark
              }}
            >
              NGN648.33/mo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveButton("6")}
            style={{
              width: "33.3333333333%",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: activeButton == "6" ? color.goldDark : color.borderColor,
              minHeight: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "text",
                fontSize: 20,
                color: activeButton == "6" ? color.goldDark : color.dark
              }}
            >
              6
            </Text>
            <Text
              style={{
                fontFamily: "text",
                color: activeButton == "6" ? color.goldDark : color.dark
              }}
            >
              Months
            </Text>
            <Text
              style={{
                fontFamily: "text",
                marginTop: 15,
                color: activeButton == "6" ? color.goldDark : color.dark
              }}
            >
              NGN971.66/mo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveButton("1")}
            style={{
              width: "33.3333333333%",
              borderWidth: 1,
              borderColor: activeButton == "1" ? color.goldDark : color.borderColor,
              minHeight: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "text",
                fontSize: 20,
                color: activeButton == "1" ? color.goldDark : color.dark
              }}
            >
              1
            </Text>
            <Text
              style={{
                fontFamily: "text",
                color: activeButton == "1" ? color.goldDark : color.dark
              }}
            >
              Month
            </Text>
            <Text
              style={{
                fontFamily: "text",
                marginTop: 15,
                color: activeButton == "1" ? color.goldDark : color.dark
              }}
            >
              NGN3,100.00/mo
            </Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[color.goldDark, color.gold, color.goldDark]}
          style={{
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "text",
                fontSize: 17,
                color: color.white
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </LinearGradient>

      </View>

      {
        activeButton == "1" &&
        <Modal
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <WebView
            source={{ uri: 'http://192.168.43.97:3000/gold' }}
            onNavigationStateChange={data => handleResponse(data)}
            injectedJavaScript={`document.querySelector("#paypalGoldOneMonth #price").value="7.40"; document.f1.submit()`}
          />
        </Modal>
      }
      {
        activeButton == "6" &&
        <Modal
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <WebView
            source={{ uri: 'http://192.168.43.97:3000/gold' }}
            onNavigationStateChange={data => handleResponse(data)}
            injectedJavaScript={`document.querySelector("#paypalGoldSixMonths #price").value="3.58"; document.f6.submit()`}
          />
        </Modal>
      }
      {
        activeButton == "12" &&
        <Modal
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <WebView
            source={{ uri: 'http://192.168.43.97:3000/gold' }}
            onNavigationStateChange={data => handleResponse(data)}
            injectedJavaScript={`document.querySelector("#paypalGoldTwelveMonths #price").value="2.39"; document.f12.submit()`}
          />
        </Modal>
      }
    </View>
  )
}

export default OymoGold