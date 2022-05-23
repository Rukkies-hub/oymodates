import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Keyboard,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  UIManager,
} from 'react-native'

import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import color from '../style/color'

import useAuth from '../hooks/useAuth'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Likecomments from './Likecomments'
import { useFonts } from 'expo-font'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import moment from 'moment'

const Comments = (params) => {
  const { userProfile, user } = useAuth()
  const post = params?.post

  const [comments, setComments] = useState([])
  const [height, setHeight] = useState(40)
  const [input, setInput] = useState('')
  const [mediaVidiblity, setMediaVidiblity] = useState(false)
  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: 1 })

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

  const sendCommentReply = (comment) => {
    console.log(comment)
    if (input != '')
      addDoc(collection(db, 'posts', comment?.post, 'comments', comment?.id, 'replies'), {
        reply: input,
        post: comment?.post,
        likesCount: 0,
        repliesCount: 0,
        user: {
          id: userProfile?.id,
          displayName: userProfile?.displayName,
          photoURL: userProfile?.photoURL
        },
        to: comment?.user?.id,
        timestamp: serverTimestamp()
      })
    setInput('')
  }

  const showReplyInput = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    setMediaVidiblity(!mediaVidiblity)
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

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
                  backgroundColor: color.offWhite,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: color.dark,
                    fontFamily: 'text',
                    fontSize: 13
                  }}
                >
                  {comment?.user?.displayName}
                </Text>
                <Text
                  style={{
                    color: color.dark
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
                  <Likecomments comment={comment} />

                  <TouchableOpacity
                    onPress={showReplyInput}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 2
                    }}
                  >
                    <Text
                      style={{
                        color: color.dark,
                        fontFamily: 'text'
                      }}
                    >
                      Reply
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginTop: 10
                  }}
                >
                  <FlatList
                    data={comment?.reply}
                    keyExtractor={item => item.id}
                    style={{
                      flex: 1
                    }}
                    renderItem={({ item: reply }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          marginTop: 10
                        }}
                      >
                        <Image
                          source={{ uri: reply?.user?.photoURL }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 50,
                          }}
                        />
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
                            {reply?.user?.displayName}
                          </Text>
                          <Text
                            style={{
                              color: color.white
                            }}
                          >
                            {reply?.reply}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </View>

                {
                  mediaVidiblity &&
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
                        flex: 1,
                        minHeight: 40,
                        height,
                        borderRadius: 50,
                        backgroundColor: color.offWhite,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        color: color.dark,
                        fontFamily: 'text'
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => sendCommentReply(comment)}
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                      }}>
                      <FontAwesome5
                        name='paper-plane'
                        color={color.lightText}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </View>
          </View>
        )}
      />
    </TouchableWithoutFeedback>
  )
}

export default Comments