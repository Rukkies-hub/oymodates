import { View, SafeAreaView, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'

import { useRoute } from '@react-navigation/core'

import Header from '../components/Header'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import useAuth from '../hooks/useAuth'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import SenderMessage from "../components/SenderMessage"
import RecieverMessage from "../components/RecieverMessage"

import firebase from "../hooks/firebase"

const MessageScreen = () => {
  const { user, userProfile } = useAuth()
  const { params } = useRoute()
  const { matchDetails } = params

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() =>
    firebase.firestore()
      .collection("matches")
      .doc(matchDetails.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      })
    , [matchDetails, firebase.collection])

  const sendMessage = () => {
    firebase.firestore()
      .collection("matches")
      .doc(matchDetails.id)
      .collection("messages")
      .doc()
      .set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        username: userProfile.username,
        avatar: userProfile.avatar,
        message: input
      })
    setInput("")
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title={getMatchedUserInfo(matchDetails.users, user.uid).username} callEnabled />

      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={messages}
          inverted={-1}
          style={{ flex: 1, padding: 10 }}
          keyExtractor={item => item.id}
          renderItem={({ item: message }) =>
            message.userId === user.uid ? (
              <SenderMessage key={message.id} messages={message} />
            ) : (
              <RecieverMessage key={message.id} messages={message} />
            )
          }
        />
      </TouchableWithoutFeedback>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        borderTopWidth: .3,
        backgroundColor: "#fff",
        height: 50
      }}>
        <TextInput
          value={input}
          placeholder="Aa.."
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          style={{ height: "100%", fontSize: 18, flex: 1 }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <SimpleLineIcons name="paper-plane" color="rgba(0,0,0,0.6)" size={20} />
        </TouchableOpacity>
      </View>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  )
}

export default MessageScreen