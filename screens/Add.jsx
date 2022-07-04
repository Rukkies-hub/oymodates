import React, { useState, useEffect, useRef } from 'react'

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
  UIManager,
  useWindowDimensions,
  Dimensions
} from 'react-native'

import Header from '../components/Header'

import color from '../style/color'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { EvilIcons, Feather } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import * as ImagePicker from 'expo-image-picker'
import useAuth from '../hooks/useAuth'

import AutoHeightImage from 'react-native-auto-height-image'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
)
  UIManager.setLayoutAnimationEnabledExperimental(true)

import { useNavigation } from '@react-navigation/native'

import { Video } from 'expo-av'

import Bar from '../components/StatusBar'

const Add = () => {
  const { user, media, setMedia, madiaString, userProfile } = useAuth()
  const navigation = useNavigation()
  const video = useRef(null)
  const windowWidth = useWindowDimensions().width

  const [input, setInput] = useState('')
  const [height, setHeight] = useState(50)
  const [expanded, setExpanded] = useState(false)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [mediaType, setMediaType] = useState('image')
  const [status, setStatus] = useState({})

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.cancelled) {
      setMedia(result.uri)
      setMediaType(result.type)
    }
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setMediaVidiblity(false)
    })
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setExpanded(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setMediaVidiblity(true)
    })
  }, [])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.dark : color.black,
        position: 'relative'
      }}
    >
      <Bar color={userProfile?.theme == 'light' ? 'dark' : 'light'} />
      <Header
        showBack
        showTitle
        showPost
        showCancelPost
        postDetails={{
          media,
          caption: input
        }}
        title='Create post'
      />

      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setMediaVidiblity(true)
          }}
        >
          <View
            style={{
              maxHeight: 400,
              overflow: 'hidden',
              paddingHorizontal: 10,
              marginTop: 20,
              flexDirection: 'row'
            }}
          >
            <TextInput
              multiline
              value={input}
              onChangeText={setInput}
              placeholder="What's on your mind..."
              placeholderTextColor={userProfile?.theme == 'light' ? color.dark : color.white}
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              style={{
                flex: 1,
                height,
                backgroundColor: userProfile?.theme == 'light' ? color.white : userProfile?.theme == 'dark' ? color.lightText : color.dark,
                maxHeight: 300,
                fontSize: 18,
                paddingVertical: 10,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: userProfile?.theme == 'light' ? color.dark : color.white
              }}
            />
            <Image
              style={{
                aspectRatio: 9 / 16,
                backgroundColor: color.black,
                width: 60
              }}
              source={{ uri: media }}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* {
          media != '' &&
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 150
            }}
          >
            <View
              style={{
                width: '100%'
              }}
            >
              {
                mediaType == 'image' ?
                  <AutoHeightImage
                    source={{ uri: media }}
                    width={Dimensions.get('window').width}
                    style={{ flex: 1 }}
                    resizeMode='cover'
                  /> :
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: windowWidth,
                      position: 'relative'
                    }}
                  >
                    <Video
                      ref={video}
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        width: windowWidth,
                        aspectRatio: 1,
                        width: "100%"
                      }}
                      source={{
                        uri: media,
                      }}
                      useNativeControls={false}
                      resizeMode='contain'
                      usePoster={true}
                      isLooping
                      onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />

                    <TouchableOpacity
                      onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                      }
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {
                        !status.isPlaying &&
                        <Feather name="play" size={60} color={color.white} />
                      }
                    </TouchableOpacity>
                  </View>
              }
            </View>
          </View>
        } */}
      </ScrollView>

      <View
        style={{
          width: '100%',
          borderTopWidth: .3,
          borderTopColor: userProfile?.theme == 'light' ? color.borderColor : userProfile?.theme == 'dark' ? color.transparent : color.transparent,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity
          onPress={pickImage}
          style={{
            width: '50%',
            height: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: 10
          }}
        >
          <EvilIcons name='image' size={24} color={userProfile?.theme == 'light' ? color.black : color.white} />
          <Text
            style={{
              color: userProfile?.theme == 'light' ? color.dark : color.white,
              fontFamily: 'text',
              marginLeft: 10
            }}
          >
            Photo/Video
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('PostCamera')}
          style={{
            width: '50%',
            height: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: 10
          }}
        >
          <EvilIcons name='camera' size={24} color={userProfile?.theme == 'light' ? color.black : color.white} />
          <Text
            style={{
              color: userProfile?.theme == 'light' ? color.dark : color.white,
              fontFamily: 'text',
              marginLeft: 10
            }}
          >
            Camera
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Add