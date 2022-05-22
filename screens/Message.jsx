import React, { useState, useEffect } from 'react'

import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager
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

import EmojiSelector, { Categories } from 'react-native-emoji-selector'

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
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <MaterialCommunityIcons name='chevron-right' color={color.lightText} size={26} />
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
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <MaterialCommunityIcons name='emoticon-happy-outline' color={color.lightText} size={26} />
        </TouchableOpacity>
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
    </View>
  )
}

export default Message