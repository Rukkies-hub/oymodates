import React, { useState, useEffect } from 'react'

import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Text
} from 'react-native'

import color from '../style/color'

import Header from '../components/Header'

import { useRoute, useNavigation } from '@react-navigation/native'

import useAuth from '../hooks/useAuth'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'

import SenderMessage from '../components/SenderMessage'
import RecieverMessage from '../components/RecieverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useFonts } from 'expo-font'

import EmojiPicker, { emojiFromUtf16 } from '../components/emojiPicker'
import { emojis } from '../components/emojiPicker/data/emojis'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import * as ImagePicker from 'expo-image-picker'

const Message = () => {
  const navigation = useNavigation()
  const { user } = useAuth()

  const { params } = useRoute()
  const { matchDetails } = params

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(50)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [activeInput, setActiveInput] = useState(false)
  const [recent, setRecent] = useState([])
  const [showRecording, setShowRecording] = useState(false)

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

  useEffect(() =>
    Keyboard.addListener('keyboardDidShow', () => {
      setExpanded(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setMediaVidiblity(false)
    })
    , [])

  useEffect(() =>
    Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setMediaVidiblity(true)
    })
    , [])

  const sendMessage = () => {
    setExpanded(false)
    if (input != '')
      addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photoURL: matchDetails.users[user.uid].photoURL,
        message: input,
        seen: false
      })
    setInput('')
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

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
        title={getMatchedUserInfo(matchDetails?.users, user.uid).username}
        showMatchAvatar
        matchAvatar={getMatchedUserInfo(matchDetails?.users, user.uid).photoURL}
        matchDetails={matchDetails}
      />
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >
        <FlatList
          inverted={-1}
          style={{
            flex: 1,
            paddingHorizontal: 10
          }}
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
          borderTopWidth: .3,
          borderTopColor: color.borderColor,
          backgroundColor: color.white,
          minHeight: 50,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {
          mediaVidiblity && <>
            <TouchableOpacity
              style={{
                width: 40,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <MaterialCommunityIcons name='camera-outline' color={color.lightText} size={26} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('MessageImageGallery')}
              style={{
                width: 40,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <MaterialCommunityIcons name='image-outline' color={color.lightText} size={26} />
            </TouchableOpacity>
          </>
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
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <MaterialCommunityIcons name='emoticon-happy-outline' color={color.lightText} size={26} />
        </TouchableOpacity>

        {
          showRecording ?
            <View
              style={{
                flex: 1,
                width: '100%',
                height: activeInput ? height : '100%',
                maxHeight: 70,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'text',
                  color: color.dark
                }}
              >
                Recording...
              </Text>
            </View> :
            <TextInput
              multiline
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              placeholder='Aa..'
              style={{
                fontSize: 18,
                flex: 1,
                width: '100%',
                height: activeInput ? height : '100%',
                maxHeight: 70,
                fontFamily: 'text',
                color: color.dark
              }}
            />
        }

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <FontAwesome5
            name='paper-plane'
            color={color.lightText}
            size={20}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onLongPress={() => setShowRecording(true)}
          onPressOut={() => setShowRecording(false)}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <FontAwesome5
            size={20}
            name="microphone-alt"
            color={color.lightText}
          />
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={{ minWidth: 250, flex: 1 }}>
          <EmojiPicker
            colSize={9}
            emojis={emojis}
            recent={recent}
            autoFocus={false}
            loading={false}
            darkMode={false}
            onSelect={emoji => setInput(`${input} ${emoji.emoji}`)}
            onChangeRecent={setRecent}
          />
        </View>
      )}
    </View>
  )
}

export default Message