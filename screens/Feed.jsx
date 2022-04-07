import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Pressable,
  RefreshControl
} from 'react-native'
import React, { useEffect, useState } from 'react'

import firebase from "../hooks/firebase"

import useAuth from "../hooks/useAuth"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import { useNavigation } from '@react-navigation/native'

import Bar from "./StatusBar"

import AutoHeightImage from 'react-native-auto-height-image'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Feed = () => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()
  const window = useWindowDimensions()

  const [posts, setPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const getPosts = () => {
    firebase.firestore()
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get()
      .then(snapshot => {
        setPosts(snapshot?.docs?.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
        setRefreshing(false)
      })
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    // wait(2000).then(() => setRefreshing(false))
    wait(2000).then(() => {
      getPosts()
    })
  }, [])

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff"
      }}
    >
      <Bar />
      {
        posts.length == 0 ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator size="large" color="rgba(0,0,0,0.8)" />
          </View>
        ) : (
          <FlatList
            data={posts}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
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
                    {
                      post.user.id != user.uid ? (
                        <Pressable
                          onPress={() => navigation.navigate("ViewProfile", {
                            user: post.user
                          })}
                        >
                          <Image
                            source={{ uri: post.user.avatar }}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 50
                            }}
                          />
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => navigation.navigate("Account")}
                        >
                          <Image
                            source={{ uri: post.user.avatar }}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 50
                            }}
                          />
                        </Pressable>
                      )
                    }
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
                  <AutoHeightImage
                    width={window.width}
                    source={{ uri: post.media }}
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

                <View style={{ paddingHorizontal: 10 }}>
                  <Text>{post.caption}</Text>
                </View>
              </View>
            )}
          />
        )
      }
    </SafeAreaView>
  )
}

export default Feed