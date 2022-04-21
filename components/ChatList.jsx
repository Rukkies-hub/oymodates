import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import firebase from '../hooks/firebase'
import AutoHeightImage from 'react-native-auto-height-image'

import useAuth from "../hooks/useAuth"

import ChatRow from './ChatRow'

import { useFonts } from 'expo-font'

import color from "../style/color"

import { useNavigation } from '@react-navigation/native'

const ChatList = () => {
  const navigation = useNavigation()

  const { user, userProfile, likes } = useAuth()
  const [matches, setMatches] = useState([])

  useEffect(() =>
    firebase.firestore()
      .collection("matches")
      .where("usersMatched", "array-contains", user.uid)
      .onSnapshot(snapshot => {
        setMatches(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      })
    , [user])

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    matches.length > 0 ? (
      <View
        style={{
          flex: 1
        }}
      >
        {
          likes.length > 0 &&
          <>
            <FlatList
              data={likes}
              horizontal
              style={{
                width: "100%",
                maxHeight: 60,
                borderBottomWidth: 1,
                borderBottomColor: color.borderColor
              }}
              keyExtractor={item => item.id}
              renderItem={({ item: like }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Likes")}
                >
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50
                    }}
                    source={{ uri: like.avatar[0] }}
                  />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("Likes")}
              style={{
                width: "100%",
                minHeight: 80,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingVertical: 10,
                marginTop: 30
              }}
            >
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50
                }}
                source={{ uri: likes[0]?.avatar[0] }}
              />
              <View
                style={{
                  marginLeft: 20
                }}
              >
                <View
                  style={{
                    fontFamily: "text",
                    fontSize: 16,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      textTransform: "capitalize",
                      fontFamily: "text",
                      fontSize: 16
                    }}
                  >
                    {likes[0]?.username}
                  </Text>
                  <View
                    style={{
                      backgroundColor: color.gold,
                      borderRadius: 50,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      marginLeft: 10
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "text",
                        fontSize: 14
                      }}
                    >
                      Likes you
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: "text",
                    color: color.labelColor,
                    fontSize: 12,
                    marginTop: 5
                  }}
                >
                  Recently active, Match now!
                </Text>
              </View>
            </TouchableOpacity>
          </>
        }
        <FlatList
          style={{
            flex: 1,
            width: "100%",
            height: 70,
            paddingHorizontal: 10
          }}
          data={matches}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatRow matchDetails={item} />}
        />
      </View>
    ) : (
      <View style={{
        flex: 1,
        padding: 20,
        justifyContent: likes.length > 0 ? "flex-start" : "center",
        alignItems: "center"
      }}>
        {
          likes.length > 0 &&
          <FlatList
            data={likes}
            horizontal
            style={{
              width: "100%",
              maxHeight: 60,
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor
            }}
            keyExtractor={item => item.id}
            renderItem={({ item: like }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Likes")}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50
                  }}
                  source={{ uri: like.avatar[0] }}
                />
              </TouchableOpacity>
            )}
          />
        }

        {
          likes.length > 0 &&
          <TouchableOpacity
            onPress={() => navigation.navigate("Likes")}
            style={{
              width: "100%",
              minHeight: 80,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingVertical: 10,
              marginTop: 30
            }}
          >
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 50
              }}
              source={{ uri: likes[0]?.avatar[0] }}
            />
            <View
              style={{
                marginLeft: 20
              }}
            >
              <View
                style={{
                  fontFamily: "text",
                  fontSize: 16,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    textTransform: "capitalize",
                    fontFamily: "text",
                    fontSize: 16
                  }}
                >
                  {likes[0]?.username}
                </Text>
                <View
                  style={{
                    backgroundColor: color.gold,
                    borderRadius: 50,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    marginLeft: 10
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "text",
                      fontSize: 14
                    }}
                  >
                    Likes you
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontFamily: "text",
                  color: color.labelColor,
                  fontSize: 12,
                  marginTop: 5
                }}
              >
                Recently active, Match now!
              </Text>
            </View>
          </TouchableOpacity>
        }

        <AutoHeightImage
          width={400}
          source={
            require("../assets/message.png")
          }
        />
      </View>
    )
  )
}

export default ChatList