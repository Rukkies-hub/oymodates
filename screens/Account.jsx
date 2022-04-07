import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
  Pressable,
  LogBox
} from 'react-native'

import React, { useRef, useState, useEffect } from 'react'

import RBSheet from "react-native-raw-bottom-sheet"

import Bar from "./StatusBar"

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import account from "../style/account"
import editProfile from '../style/editProfile'

import firebase from '../hooks/firebase'
import useAuth from "../hooks/useAuth"
import { useNavigation } from '@react-navigation/native'
import { FlatGrid } from 'react-native-super-grid'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

const Account = () => {
  const navigation = useNavigation()
  const { user, userProfile, logout } = useAuth()
  const refRBSheet = useRef()

  const [expanded, setExpanded] = useState(true)
  const [profils, setProfiles] = useState([])
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState(false)
  const [followingList, setFollowingList] = useState([])

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

      console.log("passedUserIds: ", [...passedUserIds, ...swipedUserIds])

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
        .catch(error => {
          console.log(error)
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

  useEffect(() => {
    firebase.firestore()
      .collection("following")
      .doc(user.uid)
      .collection("userFollowing")
      .onSnapshot(snapshot => {
        setFollowingList(
          snapshot.docs
            .map(doc => doc.id)
        )
      })
  }, [userProfile.id])

  return (
    <SafeAreaView style={account.container}>
      <Bar />
      <View style={account.header}>

        <Text style={account.username}>{userProfile.username}</Text>


        <View style={account.headerActions}>
          <TouchableOpacity style={account.headerActionsButton}>
            <SimpleLineIcons name="plus" color="rgba(0,0,0,0.8)" size={23} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => refRBSheet.current.open()} style={account.headerActionsButton}>
            <SimpleLineIcons name="menu" color="rgba(0,0,0,0.8)" size={23} />
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
              {
                followingList.length ?
                  <Text style={account.number}>{followingList.length}</Text>
                  : <Text style={account.number}>0</Text>
              }
              <Text style={account.numberTitle}>Following</Text>
            </View>
          </View>
        </View>
        <View style={account.about}>
          <Text>{userProfile.bio}</Text>
        </View>
      </View>

      <View style={account.action}>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={account.actionEditProfile}>
          <Text>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setExpanded(!expanded)
          }}
          style={account.explor}
        >
          <MaterialCommunityIcons name="account-plus" color="rgba(0,0,0,0.8)" size={23} />
        </TouchableOpacity>
      </View>

      {expanded && (
        <View
          style={{
            flex: 1,
            maxHeight: 100,
            minHeight: 100,
            margin: 10,
            backgroundColor: "#F4F7F8"
          }}
        >
          <FlatList
            horizontal
            data={profils}
            scrollEnabled={false}
            keyExtractor={item => item.id}
            style={{
              flex: 1
            }}
            renderItem={({ item: profile }) => (
              <Pressable
                style={{
                  marginRight: 5
                }}
              >
                <Image
                  source={{ uri: profile.avatar }}
                  style={{
                    flex: 1,
                    width: 70,
                    height: 100
                  }}
                />
              </Pressable>
            )}
          />
        </View>
      )}


      <FlatGrid
        data={posts}
        spacing={5}
        itemDimension={90}
        scrollEnabled={false}
        keyExtractor={item => item.id}
        renderItem={({ item: post }) => (
          <Pressable>
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


      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeDuration={300}
        height={140}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "#000"
          },
          container: {
            paddingHorizontal: 10
          }
        }}
      >
        <TouchableOpacity style={account.sheetsButton}>
          <SimpleLineIcons name="settings" color="#000" style={{ marginLeft: 10 }} size={23} />
          <Text style={account.sheetsSheetsButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={account.sheetsLogout}>
          <SimpleLineIcons name="logout" color="#FF4757" style={{ marginLeft: 10 }} size={23} />
          <Text style={account.sheetsLogoutText}>Logout</Text>
        </TouchableOpacity>
      </RBSheet>
    </SafeAreaView>
  )
}

export default Account