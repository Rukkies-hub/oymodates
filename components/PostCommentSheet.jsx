import React, { useRef } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'

import RBSheet from 'react-native-raw-bottom-sheet'
import useAuth from '../hooks/useAuth'
import color from '../style/color'
import Comments from './Comments'
import NewComment from './NewComment'

const PostCommentSheet = (props) => {
  const { userProfile } = useAuth()
  const refCommentSheet = useRef()

  const post = props?.post

  return (
    <>
      <TouchableOpacity
        onPress={() => refCommentSheet.current.open()}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingHorizontal: 10,
          marginTop: 10
        }}
      >
        <Image
          source={{ uri: userProfile?.photoURL || user?.photoURL }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 50,
            marginRight: 10
          }}
        />

        <View
          style={{
            backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.lightText : color.dark,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 12,
            height: 40,
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: userProfile?.appMode == 'light' ? color.lightText : color.white
            }}
          >
            Write a comment...
          </Text>
        </View>
      </TouchableOpacity>

      <RBSheet
        openDuration={300}
        closeDuration={300}
        ref={refCommentSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: color.faintBlack
          },
          container: {
            backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          },
          draggableIcon: {
            backgroundColor: userProfile?.appMode == 'light' ? color.black : color.white
          }
        }}
      >
        <Comments post={post} />

        <NewComment post={post} />
      </RBSheet>
    </>
  )
}

export default PostCommentSheet