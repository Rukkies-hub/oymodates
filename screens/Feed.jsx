import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import React, { useEffect, useState } from 'react'

import firebase from "../hooks/firebase"

import useAuth from "../hooks/useAuth"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import { useNavigation } from '@react-navigation/native'

import Bar from "./StatusBar"

const Feed = () => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()
  const window = useWindowDimensions()

  const [posts, setPosts] = useState([])

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

  console.log("posts: ", posts)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff"
      }}
    >
      <Bar />
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item: post }) => (
          <View
            style={{
              marginBottom: 10
            }}
          >
            <View
              style={{
                marginHorizontal: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 50
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={{ uri: post.user.avatar }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 50
                  }}
                />
                <Text style={{ marginLeft: 10, fontSize: 16 }}>{post.user.username}</Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <SimpleLineIcons name="options-vertical" color="#000" size={15} />
              </TouchableOpacity>
            </View>

            <View>
              <Image
                resizeMode="cover"
                source={{ uri: post.media }}
                style={{
                  width: window.width,
                  height: window.width
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                height: 50
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    marginRight: 10,
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <SimpleLineIcons name="heart" color="#000" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <SimpleLineIcons name="bubble" color="#000" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default Feed