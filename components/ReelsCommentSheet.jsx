import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Keyboard
} from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import useAuth from '../hooks/useAuth'

import ReelsComments from '../components/ReelsComments'

import { AntDesign, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import color from '../style/color'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useFonts } from 'expo-font'

import { FlatGrid } from 'react-native-super-grid'

import smileys from './emoji/smileys'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const ReelsCommentSheet = () => {
  const { user, userProfile, bottomSheetIndex, setBottomSheetIndex, reelsProps, setReelsProps } = useAuth()

  const [comment, setComment] = useState('')
  const [height, setHeight] = useState(40)
  const [expanded, setExpanded] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)

  const sendComment = async () => {
    if (comment != '') {
      addDoc(collection(db, 'reels', reelsProps?.id, 'comments'), {
        comment,
        reel: reelsProps?.id,
        commentsCount: 0,
        likesCount: 0,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL,
          username: userProfile?.username,
        },
        timestamp: serverTimestamp()
      })

      await updateDoc(doc(db, 'reels', reelsProps?.id), {
        commentsCount: increment(1)
      })

      if (reelsProps?.user?.id != user?.uid)
        await addDoc(collection(db, 'users', reelsProps?.user?.id, 'notifications'), {
          action: 'reel',
          activity: 'comments',
          text: 'commented on your post',
          notify: reelsProps?.user,
          id: reelsProps?.id,
          seen: false,
          reel: reelsProps,
          user: {
            id: userProfile?.id,
            username: userProfile?.username,
            displayName: userProfile?.displayName,
            photoURL: userProfile?.photoURL
          },
          timestamp: serverTimestamp()
        })
      setComment('')
    }
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <>
      {
        reelsProps &&
        <BottomSheet
          snapPoints={['80%']}
          index={bottomSheetIndex}
          handleHeight={40}
          enablePanDownToClose={true}
          enableOverDrag
          detached={true}
          handleIndicatorStyle={{
            display: 'none'
          }}
          backgroundStyle={{
            backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black
          }}
        >
          <View
            style={{
              height: 40,
              marginHorizontal: 10,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: userProfile?.appMode == 'light' ? color.dark : color.white
                }}
              >
                {reelsProps?.commentsCount || '0'}
              </Text>
              <Text
                style={{
                  fontFamily: 'text',
                  fontSize: 16,
                  color: userProfile?.appMode == 'light' ? color.dark : color.white,
                  marginLeft: 10
                }}
              >
                {reelsProps?.commentsCount == 1 ? 'Comment' : 'Comments'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setBottomSheetIndex(-1)
                setReelsProps(null)
              }}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <AntDesign name='close' size={20} color={userProfile?.appMode == 'light' ? color.dark : color.white} />
            </TouchableOpacity>
          </View>

          <ReelsComments reel={reelsProps} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              borderTopWidth: .3,
              borderTopColor: color.borderColor,
              backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
              minHeight: 50,
              overflow: 'hidden',
              position: 'relative',
              marginHorizontal: 10,
              borderRadius: 12
            }}
          >
            <TextInput
              multiline
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={sendComment}
              placeholder='Write a comment...'
              placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              style={{
                fontSize: 18,
                flex: 1,
                width: '100%',
                height,
                minHeight: 50,
                maxHeight: 150,
                fontFamily: 'text',
                color: userProfile?.appMode == 'light' ? color.dark : color.white,
                paddingRight: 40 + 50,
                paddingVertical: 5
              }}
            />

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss()
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                setExpanded(!expanded)

                setTimeout(() => setShowEmoji(!showEmoji), 500)
              }}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 50,
                bottom: 0
              }}>
              <MaterialCommunityIcons name='emoticon-happy-outline' color={userProfile?.appMode == 'light' ? color.lightText : color.white} size={26} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sendComment}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 0,
                bottom: 0
              }}>
              <FontAwesome5
                name='paper-plane'
                color={userProfile?.appMode == 'light' ? color.lightText : color.white}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              marginVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity onPress={() => setComment(comment + '🤣')}>
              <Text style={{ fontSize: 30 }}>🤣</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComment(comment + '😭')}>
              <Text style={{ fontSize: 30 }}>😭</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComment(comment + '🥺')}>
              <Text style={{ fontSize: 30 }}>🥺</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComment(comment + '😏')}>
              <Text style={{ fontSize: 30 }}>😏</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComment(comment + '🤨')}>
              <Text style={{ fontSize: 30 }}>🤨</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComment(comment + '🙄')}>
              <Text style={{ fontSize: 30 }}>🙄</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComment(comment + '😍')}>
              <Text style={{ fontSize: 30 }}>😍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComment(comment + '❤️')}>
              <Text style={{ fontSize: 30 }}>❤️</Text>
            </TouchableOpacity>
          </View>

          {
            expanded && (
              <View style={{ minWidth: 200, maxHeight: 200 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                  }}
                >
                  {
                    showEmoji &&
                    <FlatGrid
                      data={smileys}
                      itemDimension={30}
                      renderItem={({ item: emoji }) => (
                        <TouchableOpacity onPress={() => setComment(comment + emoji.emoji)}>
                          <Text style={{ fontSize: 30 }}>{emoji.emoji}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  }
                </View>
              </View>
            )
          }
        </BottomSheet>
      }
    </>
  )
}

export default ReelsCommentSheet