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

import useAuth from "../hooks/useAuth"

const ViewProfile = () => {
  const { params } = useRoute()
  const { user, userProfile } = useAuth()

  const navigation = useNavigation()

  const [posts, setPosts] = useState([])
  const [guestUserProfile, setGuestUserProfile] = useState({})
  const [following, setFollowing] = useState(false)
  const [followingList, setFollowingList] = useState([])

  useEffect(async () =>
    await firebase.firestore().collection("users")
      .doc(params.user.id)
      .get().then(doc => {
        setGuestUserProfile(doc?.data())
      })
    , [])

  useEffect(() =>
    firebase.firestore()
      .collection("posts")
      .where("user.id", "==", params.user.id)
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

  const follow = () => {
    firebase.firestore()
      .collection("following")
      .doc(user.uid)
      .collection("userFollowing")
      .doc(guestUserProfile.id)
      .set({})
  }

  const unfollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(user.uid)
      .collection("userFollowing")
      .doc(guestUserProfile.id)
      .delete()
  }

  useEffect(() => {
    firebase.firestore()
      .collection("following")
      .doc(user.uid)
      .collection("userFollowing")
      .onSnapshot(snapshot => {
        setFollowingList(
          snapshot.docs
            .filter(doc => doc.id == guestUserProfile.id)
            .map(doc => doc.id)
        )

        if (followingList.indexOf(guestUserProfile.id) > -1)
          setFollowing(true)
        else setFollowing(false)
      })
  }, [guestUserProfile.id, following])


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

          <Text style={account.username}>{guestUserProfile.username}</Text>
        </View>


        <View style={account.headerActions}>
          <TouchableOpacity style={account.headerActionsButton}>
            <SimpleLineIcons name="options-vertical" color="rgba(0,0,0,0.8)" size={19} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={account.detail}>
        <View style={account.state}>
          <TouchableWithoutFeedback style={account.avatar}>
            <Image
              style={editProfile.avatarImage}
              source={guestUserProfile.avatar ? { uri: guestUserProfile.avatar } : require('../assets/pph.jpg')}
            />
          </TouchableWithoutFeedback>

          <View style={account.detailCount}>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>{posts.length}</Text>
              <Text style={account.numberTitle}>Posts</Text>
            </View>
            <View style={account.detailCountInfo}>
              {
                followingList.indexOf(guestUserProfile.id) > -1 ?
                  <Text style={account.number}>{followingList.length}</Text>
                  : <Text style={account.number}>0</Text>
              }
              <Text style={account.numberTitle}>Followers</Text>
            </View>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>0</Text>
              <Text style={account.numberTitle}>Following</Text>
            </View>
          </View>
        </View>
        <View style={account.about}>
          <Text>{guestUserProfile.bio}</Text>
        </View>
      </View>

      <View style={account.action}>
        {
          (following || (followingList.indexOf(guestUserProfile.id) > -1)) ? (
            <TouchableOpacity
              onPress={unfollow}
              style={{
                height: 40,
                width: 335,
                backgroundColor: "#FF4757",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={{ color: "#fff" }}>Unfollow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={follow}
              style={{
                height: 40,
                width: 335,
                backgroundColor: "#FF4757",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={{ color: "#fff" }}>Follow</Text>
            </TouchableOpacity>
          )
        }
        <TouchableOpacity
          style={account.explor}
        >
          <SimpleLineIcons name="user-follow" color="rgba(0,0,0,0.8)" size={22} />
        </TouchableOpacity>
      </View>

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
                width: '100%',
                height: 120,
              }}
            />
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}

export default ViewProfile