import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LogBox,
} from 'react-native'

import React, { useState, useEffect } from 'react'

import Bar from "./StatusBar"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import account from "../style/account"

import firebase from '../hooks/firebase'
import useAuth from "../hooks/useAuth"
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

const Account = () => {
  const navigation = useNavigation()
  const { user, userProfile, logout } = useAuth()
  const [profils, setProfiles] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const passes = await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("passes")
        .get()
        .then(snapshot => snapshot?.docs?.map(doc => doc.id))

      const swipes = await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("swipes")
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.id))


      const passedUserIds = passes.length > 0 ? passes : ['test']
      const swipedUserIds = swipes.length > 0 ? swipes : ['test']

      await firebase.firestore()
        .collection("users")
        .where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        .get()
        .then((snapshot) => {
          setProfiles(
            snapshot.docs
              .filter(doc => doc.id !== user.uid)
              .map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
          )
        })
    }

    fetchUsers()
  }, [])

  useEffect(async () =>
    firebase.firestore()
      .collection("posts")
      .where("user.id", "==", user.uid)
      .get()
      .then(snapshot => {
        setPosts(snapshot?.docs?.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      })
    , [])

  useEffect(() =>
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested",
      "Setting a timer for a long period of time",
      "Uncaught Error in snapshot listener"
    ])
    , [])

  return (
    <SafeAreaView style={account.container}>
      <Bar />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          left: 10,
          top: 10,
          width: 40,
          height: 40
        }}
      >
        <MaterialCommunityIcons name='chevron-left' color="#000" size={30} />
      </TouchableOpacity>
      <View style={account.detail}>
        <View style={{
          justifyContent: "center",
          alignItems: "center"
        }}>
          <TouchableWithoutFeedback>
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 100
              }}
              source={userProfile.avatar ? { uri: userProfile?.avatar[0] } : require('../assets/pph.jpg')}
            />
          </TouchableWithoutFeedback>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                marginTop: 20
              }}
            >
              {userProfile.name}, {moment().diff(new Date(userProfile.date), "years")}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: -40,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("EditPersonalInformation")}
          style={{
            width: 70,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: .3,
            borderRadius: 50,
            borderColor: "rgba(0,0,0,0.3)"
          }}
        >
          <MaterialCommunityIcons name='cog' color="#000" size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          style={{
            width: 70,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: .3,
            borderRadius: 50,
            borderColor: "rgba(0,0,0,0.3)",
            marginTop: 100
          }}
        >
          <MaterialCommunityIcons name='pencil' color="#000" size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: .3,
            borderRadius: 50,
            borderColor: "rgba(0,0,0,0.3)"
          }}
        >
          <MaterialCommunityIcons name='shield' color="#000" size={22} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Account