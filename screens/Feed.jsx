import {
  View,
  Text,
  StatusBar,
  FlatList,
  ImageBackground,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

import firebase from "../hooks/firebase"

import useAuth from "../hooks/useAuth"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import moment from 'moment'

import { useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get("window")
const ITEM_SIZE = (height - 50) * 1
const SPACING = 10
const FULLSIZE = ITEM_SIZE + SPACING * 1

const Feed = () => {
  const { user, userProfile } = useAuth()
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState([])

  const window = useWindowDimensions()

  const navigation = useNavigation()

  useEffect(async () =>
    firebase.firestore()
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setPosts(snapshot?.docs?.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      })
    , [])

  const followUser = async (item) => {
    firebase.firestore()
      .collection("following")
      .doc(user.uid)
      .collection("userFollowing")
      .doc(item.user.id)
      .set({})
  }

  const unFollowUser = async (item) => {
    firebase.firestore()
      .collection("following")
      .doc(user.uid)
      .collection("userFollowing")
      .doc(item.user.id)
      .delete()
  }

  useEffect(() => {
  }, [])

  return (
    <View style={{
      flex: 1,
      backgroundColor: "#fff"
    }}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          bounces={false}
          snapToAlignment="center"
          snapToInterval={FULLSIZE}
          decelerationRate="fast"
          keyExtractor={item => item.id}
          style={{
            flex: 1
          }}
          renderItem={({ item }) => (
            <ImageBackground
              source={{ uri: item.media }}
              resizeMode="cover"
              style={{
                flex: 1,
                width: window.width,
                height: window.height - 50,
                position: "relative",
              }}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)']}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  minHeight: 100,
                  maxHeight: 150,
                  width: window.width,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingHorizontal: 10
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      textTransform: "capitalize"
                    }}
                  >
                    @{item.user.username}
                  </Text>

                  <Text
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      marginLeft: 10,
                      fontSize: 14
                    }}
                  >
                    {moment().startOf(item?.timestamp?.seconds).fromNow()}
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18
                  }}
                >
                  {item.caption}
                </Text>
              </LinearGradient>

              <View
                style={{
                  position: "absolute",
                  bottom: 200,
                  right: 10,
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  borderRadius: 50
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("ViewProfile", {
                    user: item.user
                  })}
                  style={{
                    position: "relative",
                    marginBottom: 25,
                    borderWidth: 2,
                    borderRadius: 50,
                    width: 44.2,
                    height: 44.2,
                    borderColor: "#FF4757"
                  }}
                >
                  <Image
                    source={{ uri: item.user.avatar }}
                    style={{
                      width: 40,
                      height: 40,
                      position: "absolute",
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginBottom: 20
                  }}
                >
                  <SimpleLineIcons name="heart" color="#fff" size={30} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginBottom: 20
                  }}
                >
                  <SimpleLineIcons name="bubbles" color="#fff" size={30} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <SimpleLineIcons name="action-redo" color="#fff" size={30} />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}
        />
      </View>
    </View>
  )
}

export default Feed