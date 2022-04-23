import React, { useState, useEffect } from "react"

import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
  UIManager
} from "react-native"

import { useRoute, useNavigation } from "@react-navigation/native"

import Header from "../components/Header"

import getMatchedUserInfo from "../lib/getMatchedUserInfo"

import useAuth from "../hooks/useAuth"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import SenderMessage from "../components/SenderMessage"

import RecieverMessage from "../components/RecieverMessage"

import firebase from "../hooks/firebase"

import EmojiSelector, { Categories } from "react-native-emoji-selector"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import * as ImagePicker from "expo-image-picker"
import color from "../style/color"

export default () => {
  const navigation = useNavigation()
  const { user, userProfile } = useAuth()
  const { params } = useRoute()
  const { matchDetails } = params

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(50)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)

  useEffect(() =>
    firebase.firestore()
      .collection("matches")
      .doc(matchDetails?.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      })
    , [matchDetails, firebase.collection])

  useEffect(() =>
    Keyboard.addListener("keyboardDidShow", () => {
      setExpanded(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setMediaVidiblity(!mediaVidiblity)
    })
    , [])

  useEffect(() =>
    firebase.firestore()
      .collection("matches")
      .doc(matchDetails?.id)
      .collection("messages")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({
            seen: true
          })
        })
      })
    , [])

  const sendMessage = () => {
    setExpanded(false)
    if (input != "")
      firebase.firestore()
        .collection("matches")
        .doc(matchDetails?.id)
        .collection("messages")
        .doc()
        .set({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          userId: user.uid,
          username: userProfile.username,
          avatar: userProfile.avatar,
          message: input,
          seen: false
        })
    setInput("")
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    })

    if (!result.cancelled) {
      navigation.navigate("PreviewImage", {
        image: result.uri,
        matchDetails
      })
    }
  }

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      navigation.navigate("PreviewImage", {
        image: result.uri,
        matchDetails
      })
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <Header title={getMatchedUserInfo(matchDetails.users, user.uid).username} callEnabled />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setMediaVidiblity(true)
        }}>
        <FlatList
          data={messages}
          inverted={-1}
          style={{ flex: 1, paddingHorizontal: 10 }}
          keyExtractor={item => item.id}
          renderItem={({ item: message }) =>
            message.userId === user.uid ? (
              <SenderMessage key={message.id} messages={message} matchDetails={matchDetails} />
            ) : (
              <RecieverMessage key={message.id} messages={message} matchDetails={matchDetails} />
            )
          }
        />
      </TouchableWithoutFeedback>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingHorizontal: 10,
          borderTopWidth: .3,
          backgroundColor: color.white,
          minHeight: 50,
          overflow: "hidden"
        }}
      >
        {
          mediaVidiblity && <>
            <TouchableOpacity
              onPress={openCamera}
              style={{
                width: 40,
                height: 50,
                justifyContent: "center",
                alignItems: "center"
              }}>
              <MaterialCommunityIcons name="camera-outline" color={color.lightText} size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 40,
                height: 50,
                justifyContent: "center",
                alignItems: "center"
              }}>
              <MaterialCommunityIcons name="image-outline" color={color.lightText} size={20} />
            </TouchableOpacity>
          </>
        }
        {
          !mediaVidiblity &&
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss()
              setMediaVidiblity(!mediaVidiblity)
            }}
            style={{
              width: 40,
              height: 50,
              justifyContent: "center",
              alignItems: "center"
            }}>
            <MaterialCommunityIcons name="mdi-chevron-right" color={color.lightText} size={20} />
          </TouchableOpacity>
        }
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss()
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setExpanded(!expanded)
          }}
          style={{
            width: 40,
            height: 50,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <MaterialCommunityIcons name="emoticon-happy-outline" color={color.lightText} size={20} />
        </TouchableOpacity>
        <TextInput
          multiline
          value={input}
          placeholder="Aa.."
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          style={{ fontSize: 18, flex: 1, width: "100%", height: height, maxHeight: 70 }}
          onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            width: 40,
            height: 50,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <MaterialCommunityIcons name="mdi-telegram" color={color.lightText} size={20} />
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={{ minWidth: 250, flex: 1 }}>
          <EmojiSelector
            columns={9}
            showSearchBar={false}
            showSectionTitles={false}
            category={Categories.emotion}
            onEmojiSelected={emoji => setInput(`${input} ${emoji}`)}
          />
        </View>
      )}
    </SafeAreaView>
  )
}
