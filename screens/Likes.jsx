import { View, Text, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'

import color from "../style/color"

import { useFonts } from 'expo-font'

import firebase from "../hooks/firebase"
import useAuth from '../hooks/useAuth'

const Likes = () => {
  const { user, uerProfile } = useAuth()

  const [likes, setLikes] = useState([])

  useEffect(() =>
    firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .collection("pendingSwipes")
      .onSnapshot(snapshot => {
        setLikes(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      })
    , [uerProfile])
  
  const [loaded] = useFonts({
    logo: require("../assets/fonts/Pacifico/Pacifico-Regular.ttf"),
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Text>Likes</Text>
    </SafeAreaView>
  )
}

export default Likes