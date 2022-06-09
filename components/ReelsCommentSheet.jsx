import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import useAuth from '../hooks/useAuth'

import ReelsComments from '../components/ReelsComments'

import { AntDesign, FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons'
import color from '../style/color'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useFonts } from 'expo-font'

const ReelsCommentSheet = () => {
  const { userProfile, bottomSheetIndex, setBottomSheetIndex, reelsProps, setReelsProps } = useAuth()

  const [comment, setComment] = useState('')
  const [height, setHeight] = useState(40)

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
          snapPoints={['70%']}
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
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setBottomSheetIndex(-1)
                setReelsProps(null)
              }}
              style={{
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 5,
                  backgroundColor: userProfile?.appMode == 'light' ? color.dark : color.white,
                  borderRadius: 12
                }}
              />
            </TouchableOpacity>
          </View>

          <ReelsComments reel={reelsProps} />

          <View
            style={{
              minHeight: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10
            }}
          >
            <Image
              source={{ uri: reelsProps?.user?.photoURL }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50
              }}
            />
            <TextInput
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={sendComment}
              placeholder='Write a comment...'
              placeholderTextColor={userProfile?.appMode == 'light' ? color.dark : color.white}
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              style={{
                flex: 1,
                marginHorizontal: 10,
                backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
                minHeight: 40,
                borderRadius: 12,
                fontSize: 18,
                height,
                maxHeight: 150,
                fontFamily: 'text',
                color: userProfile?.appMode == 'light' ? color.dark : color.white,
                paddingHorizontal: 10
              }}
            />
            <TouchableOpacity
              onPress={sendComment}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <FontAwesome5
                name='paper-plane'
                color={userProfile?.appMode == 'light' ? color.lightText : color.white}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </BottomSheet>
      }
    </>
  )
}

export default ReelsCommentSheet