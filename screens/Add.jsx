import React, { useState } from "react"

import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions
} from "react-native"
import color from "../style/color"

import { useFonts } from "expo-font"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Header from "../components/Header"

import * as ImagePicker from 'expo-image-picker'

import { useNavigation } from "@react-navigation/native"

import { SwiperFlatList } from "react-native-swiper-flatlist"

import AutoHeightImage from "react-native-auto-height-image"

const width = Dimensions.get("window").width

const ITEM_SIZE = width

const Add = () => {
  const navigation = useNavigation()
  const [caption, setCaption] = useState("")
  const [height, setHeight] = useState(50)
  const [postloading, setPostloading] = useState(false)
  const [image, setImage] = useState([])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [1, 1],
      quality: 1,
    });


    if (!result.cancelled) {
      // setImage(result.uri)
      setImage(oldArray => [...oldArray, result.uri])
    }
  }

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  console.log(image)

  const [loaded] = useFonts({
    text: require("../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf")
  })

  if (!loaded)
    return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header title="New post" />

      <View
        style={{
          paddingHorizontal: 10
        }}
      >
        <View
          style={{
            width: "100%"
          }}
        >
          <View
            style={{
              minHeight: 50,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor
            }}
          >
            <TextInput
              multiline
              placeholder="Aa..."
              value={caption}
              onChangeText={value => setCaption(value)}
              onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
              maxLength={250}
              style={{
                height: height,
                width: "100%",
                fontFamily: "text",
                color: color.lightText,
                fontSize: 18,
                maxHeight: 100
              }}
            />
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "text",
                color: color.lightText
              }}
            >
              {caption.length}/250
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <TouchableOpacity
              onPress={openCamera}
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10
              }}
            >
              <MaterialCommunityIcons name="camera-outline" color={color.lightText} size={25} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <MaterialCommunityIcons name="image-outline" color={color.lightText} size={25} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPostloading(!postloading)}
              style={{
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: color.red,
                borderRadius: 50,
                marginLeft: 20
              }}
            >
              {
                postloading ? <ActivityIndicator size="small" color={color.white} />
                  : <MaterialCommunityIcons name="feather" color={color.white} size={30} />
              }
            </TouchableOpacity>
          </View>

          <View>
            <FlatList
              horizontal
              data={image}
              keyExtractor={(item, key) => key}
              index={0}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: ITEM_SIZE,
                    minHeight: ITEM_SIZE / 2 + 50,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <AutoHeightImage
                    width={ITEM_SIZE}
                    source={{uri: item}}
                  />
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Add