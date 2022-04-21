import { View, Text, Image, Pressable, LayoutAnimation, UIManager, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'

import color from "../style/color"
import useAuth from '../hooks/useAuth'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import RBSheet from "react-native-raw-bottom-sheet"

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import firebase from '../hooks/firebase'

const SenderMessage = ({ messages, matchDetails }) => {
  const { userProfile } = useAuth()

  const refRBSheet = useRef()

  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState({})

  const delectMessage = () => {
    if (messages?.image) {
      const fileRef = firebase.storage().refFromURL(messages?.image)

      fileRef.delete().then(() => {
        firebase.firestore()
          .collection("matches")
          .doc(matchDetails.id)
          .collection("messages")
          .doc(message.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!")
          }).catch((error) => {
            console.error("Error removing document: ", error)
          })
      })
    } else {
      firebase.firestore()
        .collection("matches")
        .doc(matchDetails.id)
        .collection("messages")
        .doc(message.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!")
        }).catch((error) => {
          console.error("Error removing document: ", error)
        })
    }
  }


  return (
    <View style={{ flexDirection: "row-reverse", marginBottom: 10 }}>
      <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={{ uri: userProfile?.avatar[0] }} />
      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 10,
          maxWidth: "80%"
        }}
      >
        <Pressable
          onLongPress={() => {
            setMessage(messages)
            refRBSheet.current.open()
          }}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setExpanded(!expanded)
          }}
          style={{
            backgroundColor: messages.message ? color.purple : "transparent",
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          {
            messages.message && <Text
              style={{ color: "#fff", fontSize: 18, textAlign: "right" }}
            >
              {messages.message}
            </Text>
          }
          {
            messages.image &&
            <View
              style={{
                position: "relative",
                width: 300,
                height: 300,
                borderWidth: 2,
                borderRadius: 20,
                overflow: "hidden",
                borderColor: color.purple,
                right: 6
              }}
            >
              <Image style={{
                flex: 1,
                width: "100%",
                height: "100%"
              }}
                source={{ uri: messages.image }}
              />
              <View
                style={{
                  width: "100%",
                  height: 30,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingHorizontal: 10
                }}
              >
                <Text>{messages.caption}</Text>
              </View>
            </View>
          }
        </Pressable>
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeDuration={300}
        height={100}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%"
          }}
        >
          <TouchableOpacity
            style={{
              height: "100%",
              width: "25%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SimpleLineIcons name="action-undo" color="rgba(0,0,0,0.8)" size={25} style={{ marginTop: -20 }} />
            <Text>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: "100%",
              width: "25%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SimpleLineIcons name="docs" color="rgba(0,0,0,0.8)" size={25} style={{ marginTop: -20 }} />
            <Text>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: "100%",
              width: "25%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SimpleLineIcons name="arrow-right-circle" color="rgba(0,0,0,0.8)" size={25} style={{ marginTop: -20 }} />
            <Text>Forward</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={delectMessage}
            style={{
              height: "100%",
              width: "25%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SimpleLineIcons name="trash" color="rgba(0,0,0,0.8)" size={25} style={{ marginTop: -20 }} />
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  )
}

export default SenderMessage