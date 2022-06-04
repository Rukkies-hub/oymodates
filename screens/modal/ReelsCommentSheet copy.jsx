import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput
} from 'react-native'

import RBSheet from "react-native-raw-bottom-sheet"

import { AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import color from '../../style/color'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import useAuth from '../../hooks/useAuth'
import { db } from '../../hooks/firebase'
import ReelsComments from '../../components/ReelsComments'
import { useFonts } from 'expo-font'

const ReelsCommentSheet = (props) => {
  const refRBSheet = useRef()
  const { userProfile } = useAuth()

  const reel = props?.item

  const [comment, setComment] = useState('')
  const [height, setHeight] = useState(40)

  const sendComment = async () => {
    if (comment != '') {
      addDoc(collection(db, 'reels', reel?.id, 'comments'), {
        comment,
        reel: reel?.id,
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

      await updateDoc(doc(db, 'reels', reel?.id), {
        commentsCount: increment(1)
      })
      setComment('')
    }
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          refRBSheet.current.open()
        }}
        style={{
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <FontAwesome name="comment" size={24} color={color.white} />
        <Text
          style={{
            color: color.white,
            fontFamily: 'text',
            marginTop: 5
          }}
        >
          {reel?.commentsCount}
        </Text>
      </TouchableOpacity>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeDuration={300}
        height={Dimensions.get('window').height / 2}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: color.black
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          }
        }}
      >

        <ReelsComments reel={reel} />

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
            source={{ uri: reel?.user?.photoURL }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50
            }}
          />
          <TextInput
            value={comment}
            onChangeText={setComment}
            onSubmitEditing={sendComment}
            placeholder='Write a comment...'
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            style={{
              flex: 1,
              marginHorizontal: 10,
              backgroundColor: color.offWhite,
              minHeight: 40,
              borderRadius: 12,
              fontSize: 18,
              height,
              maxHeight: 150,
              fontFamily: 'text',
              color: color.dark,
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
              color={color.lightText}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </RBSheet>
    </>
  )
}

export default ReelsCommentSheet