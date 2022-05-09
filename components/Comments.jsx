import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Keyboard,
  TouchableOpacity,
  TextInput
} from 'react-native'

import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import color from '../style/color'

import useAuth from '../hooks/useAuth'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const Comments = (params) => {
  const { userProfile, user } = useAuth()
  const post = params?.post

  const [comments, setComments] = useState([])
  const [commentsLikes, setCommentsLikes] = useState([])

  const [height, setHeight] = useState(40)
  const [input, setInput] = useState('')

  useEffect(() =>
    onSnapshot(collection(db, 'posts', post.id, 'comments'),
      snapshot =>
        setComments(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
    )
    , [])

  const likeComment = async (comment) => {
    comment?.likes?.includes(user.uid) ?
      await updateDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id), {
        likes: arrayRemove(userProfile?.id)
      }) :
      await updateDoc(doc(db, 'posts', comment?.post?.id, 'comments', comment?.id), {
        likes: arrayUnion(userProfile?.id)
      })
  }

  const sendCommentReply = async (comment) => {
    // if (input != '')
      // addDoc(collection(db, ''))
  }

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
                width: '100%',
                alignItems: 'flex-start'
              }}
            >
              <View
                style={{
                  marginLeft: 10,
                  backgroundColor: color.blue,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
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

              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 10,
                  marginTop: 5
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 4
                  }}
                >
                  <TouchableOpacity
                    onPress={() => likeComment(comment)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      marginRight: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}
                  >
                    {
                      comment?.likes?.length > 0 &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <Image
                          source={require('../assets/heart.png')}
                          style={{
                            width: 15,
                            height: 15
                          }}
                        />
                        <Text
                          style={{
                            color: comment?.likes.includes(user.uid) ? color.red : color.dark
                          }}
                        >
                          {`${comment?.likes?.length} `}
                        </Text>
                      </View>
                    }
                    <Text
                      style={{
                        color: comment?.likes.includes(user.uid) ? color.red : color.dark
                      }}
                    >
                      {
                        comment?.likes?.length <= 1 ? 'Like' : 'Likes'
                      }
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 2
                    }}
                  >
                    <Text
                      style={{
                        color: color.dark
                      }}
                    >
                      Reply
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    paddingRight: 20,
                    marginTop: 10
                  }}
                >
                  <TextInput
                    multiline
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => sendCommentReply(comment)}
                    onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                    placeholder={`Reply ${comment?.user?.displayName}`}
                    style={{
                      minHeight: 40,
                      height,
                      borderRadius: 12,
                      backgroundColor: color.offWhite,
                      width: '85%',
                      paddingHorizontal: 10,
                      color: color.dark
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => sendCommentReply(comment)}
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10,
                      backgroundColor: color.blue,
                      borderRadius: 12
                    }}>
                    <FontAwesome5
                      name='paper-plane'
                      color={color.white}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </TouchableWithoutFeedback>
  )
}

export default Comments