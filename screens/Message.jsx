import React, { useState, useEffect } from 'react'

import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native'

import color from '../style/color'

import Header from '../components/Header'

import { useRoute } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

import SenderMessage from "../components/SenderMessage"
import RecieverMessage from "../components/RecieverMessage"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

const Message = () => {
  const { user } = useAuth()

  const { params } = useRoute()
  const { matchDetails } = params

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(50)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)

  useEffect(() =>
    onSnapshot(query(collection(db,
      'matches', matchDetails.id, 'messages'),
      orderBy('timestamp', 'desc')),
      snapshot => setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    )
    , [matchDetails, db])

  const sendMessage = () => {
    setExpanded(false)
    if (input != "")
      addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photoURL: matchDetails.users[user.uid].photoURL,
        message: input
      })

    setInput("")
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header
        showBack
        showTitle
        showPhone
        showVideo
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        showMatchAvatar
        matchAvatar={getMatchedUserInfo(matchDetails?.users, user.uid).photoURL}
      />
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >
        <FlatList
          inverted={-1}
          style={{ flex: 1, paddingHorizontal: 10 }}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item: message }) => (
            message.userId === user.uid ? (
              <SenderMessage key={message.id} messages={message} matchDetails={matchDetails} />
            ) : (
              <RecieverMessage key={message.id} messages={message} matchDetails={matchDetails} />
            )
          )}
        />
      </TouchableWithoutFeedback>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          borderTopWidth: .3,
          borderTopColor: color.borderColor,
          backgroundColor: color.white,
          minHeight: 50,
          overflow: "hidden",
          position: 'relative'
        }}
      >
        <TextInput
          multiline
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
          placeholder="Aa.."
          style={{
            fontSize: 18,
            flex: 1,
            width: "100%",
            height,
            maxHeight: 70,
            fontFamily: "text",
            color: color.lightText,
            paddingRight: 40,
            paddingVertical: 5
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            position: 'absolute',
            right: 0,
            bottom: 0
          }}>
          <FontAwesome5
            name="paper-plane"
            color={color.lightText}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Message