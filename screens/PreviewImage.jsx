import React, { useState } from 'react'
import { View, Text, ImageBackground, TouchableOpacity, TextInput } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { useNavigation, useRoute } from '@react-navigation/core'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

import firebase from '../hooks/firebase'

import useAuth from '../hooks/useAuth'

const PreviewImage = () => {
  const { user, userProfile } = useAuth()
  const navigation = useNavigation()
  const { params } = useRoute()

  const [caption, setCaption] = useState("")
  const [height, setHeight] = useState(50)

  const sendImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }

      xhr.responseType = "blob"
      xhr.open("GET", params.image, true)
      xhr.send(null)
    })

    const ref = firebase.storage().ref().child(`messages/${new Date().toISOString()}`)
    const snapshot = ref.put(blob)

    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
    }, (error) => {
      blob.close()
      return
    }, () => {
      snapshot.snapshot.ref.getDownloadURL().then(url => {

        firebase.firestore()
          .collection("matches")
          .doc(params.matchDetails.id)
          .collection("messages")
          .doc()
          .set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: user.uid,
            username: userProfile.username,
            avatar: userProfile.avatar,
            image: url,
            caption: caption
          })
        
        setCaption("")

        navigation.goBack()

        blob.close()
        return url
      })
    })
  }

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <StatusBar style="light" />
      <ImageBackground source={{ uri: params.image }} resizeMode="contain" style={{ flex: 1, position: "relative" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: "#fff",
            width: 50,
            height: 50,
            borderRadius: 50,
            position: "absolute",
            top: 32,
            left: 10,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <SimpleLineIcons name="arrow-left" color="#000" size={22} />
        </TouchableOpacity>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingHorizontal: 10,
            borderTopWidth: .3,
            backgroundColor: "#fff",
            minHeight: 50,
            overflow: "hidden"
          }}
        >
          <TextInput
            multiline
            value={caption}
            placeholder="Caption..."
            onChangeText={setCaption}
            onSubmitEditing={sendImage}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            style={{
              fontSize: 18,
              flex: 1,
              width: 50,
              height: height,
              maxHeight: 70
            }}
          />
          <TouchableOpacity
            onPress={sendImage}
            style={{
              width: 40,
              height: 50,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SimpleLineIcons name="paper-plane" color="#000" size={22} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

export default PreviewImage