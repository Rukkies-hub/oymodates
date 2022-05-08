import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, FlatList, Image, Keyboard } from 'react-native'
import { db } from '../hooks/firebase'
import color from '../style/color'

const Comments = (params) => {
  const post = params?.post

  const [comments, setComments] = useState([])

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

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <FlatList
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
  )
}

export default Comments