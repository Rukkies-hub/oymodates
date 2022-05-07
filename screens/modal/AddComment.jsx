import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image
} from 'react-native'

import Header from '../../components/Header'

import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

import { useFonts } from 'expo-font'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const AddComment = (params) => {
  const { user, userProfile } = useAuth()
  const post = params.route.params.post

  const [height, setHeight] = useState(50)
  const [input, setInput] = useState('')
  const [comments, setComments] = useState([])

  console.log(post)

  const sendComment = () => {
    if (input != '')
      addDoc(collection(db, 'posts', post.id, 'comments'), {
        comment: input,
        user: userProfile
      })
    setInput('')
  }

  useEffect(() =>
    onSnapshot(collection(db, 'posts', post.id, 'comments'),
      snapshot =>
        setComments(
          snapshot.docs?.map(doc => ({
            id: doc?.id,
            ...doc.data()
          }))
        )
    )
    , [])

  console.log('comments: ', comments)

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showBack showTitle title='Comment' />

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >
        <FlatList
          inverted={-1}
          data={comments}
          keyExtractor={item => item.id}
          style={{
            flex: 1,
            paddingHorizontal: 10
          }}
          renderItem={({ item: comment }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginVertical: 10
              }}
            >
              <Image
                source={{ uri: comment?.user?.photoURL }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 50
                }}
              />
              <View
                style={{
                  marginLeft: 10,
                  backgroundColor: color.blue,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4
                }}
              >
                <Text
                  style={{
                    color: color.white,
                    fontFamily: 'text',
                    fontSize: 13
                  }}
                >
                  {comment?.user?.displayName}
                </Text>
                <Text
                  style={{
                    color: color.white
                  }}
                >
                  {comment?.comment}
                </Text>
              </View>
            </View>
          )}
        />
      </TouchableWithoutFeedback>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          borderTopWidth: .3,
          borderTopColor: color.borderColor,
          backgroundColor: color.white,
          minHeight: 50,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <TextInput
          multiline
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendComment}
          placeholder='Write a comment...'
          onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
          style={{
            fontSize: 18,
            flex: 1,
            width: '100%',
            height,
            maxHeight: 150,
            fontFamily: 'text',
            color: color.lightText,
            paddingRight: 40,
            paddingVertical: 5
          }}
        />

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
            color={color.lightText}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddComment