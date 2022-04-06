import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  LogBox
} from 'react-native'

import React, { useState, useEffect } from 'react'

import { useRoute, useNavigation } from '@react-navigation/native'

import Bar from "./StatusBar"

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import account from "../style/account"
import editProfile from '../style/editProfile'

import firebase from '../hooks/firebase'
import { FlatGrid } from 'react-native-super-grid'

const ViewProfile = () => {
  const { params } = useRoute()

  const navigation = useNavigation()

  const [posts, setPosts] = useState([])
  const [userProfile, setUserProfile] = useState({})

  useEffect(async () =>
    await firebase.firestore().collection("users")
      .doc(params.user.id)
      .get().then(doc => {
        setUserProfile(doc?.data())
      })
    , [])

  useEffect(async () =>
    firebase.firestore()
      .collection("posts")
      .where("user.id", "==", params.user.id)
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
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
      <View style={account.header}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SimpleLineIcons name="arrow-left" color="rgba(0,0,0,0.8)" size={23} />
          </TouchableOpacity>

          <Text style={account.username}>{userProfile.username}</Text>
        </View>


        <View style={account.headerActions}>
          <TouchableOpacity style={account.headerActionsButton}>
            <SimpleLineIcons name="options-vertical" color="rgba(0,0,0,0.8)" size={23} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={account.detail}>
        <View style={account.state}>
          <TouchableWithoutFeedback style={account.avatar}>
            <Image
              style={editProfile.avatarImage}
              source={userProfile.avatar ? { uri: userProfile.avatar } : require('../assets/pph.jpg')}
            />
          </TouchableWithoutFeedback>

          <View style={account.detailCount}>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>{posts.length}</Text>
              <Text style={account.numberTitle}>Posts</Text>
            </View>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>0</Text>
              <Text style={account.numberTitle}>Followers</Text>
            </View>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>0</Text>
              <Text style={account.numberTitle}>Following</Text>
            </View>
          </View>
        </View>
        <View style={account.about}>
          <Text>{userProfile.bio}</Text>
        </View>
      </View>

      <View style={account.action}>
        <TouchableOpacity style={{
          height: 40,
          width: 335,
          backgroundColor: "#FF4757",
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text style={{ color: "#fff" }}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={account.explor}
        >
          <SimpleLineIcons name="user-follow" color="rgba(0,0,0,0.8)" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{
          flex: 1
        }}
      >
        <FlatGrid
          data={posts}
          itemDimension={70}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item: post }) => (
            <Pressable
              style={{
                borderRadius: 12,
                overflow: "hidden"
              }}
            >
              <Image
                source={{ uri: post.media }}
                style={{
                  flex: 1,
                  width: "100%",
                  height: 160
                }}
              />
            </Pressable>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default ViewProfile