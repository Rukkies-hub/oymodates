import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { RadioButton } from 'react-native-paper'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import editProfile from '../style/editProfile'

import Bar from "./StatusBar"

import useAuth from "../hooks/useAuth"
import { FlatGrid } from 'react-native-super-grid'

import firebase from '../hooks/firebase'

import _const from "../style/const"
import color from '../style/color'
import { useFonts } from 'expo-font'

const EditProfile = ({ navigation }) => {
  const { userProfile, user, pickImage, getUserProfile } = useAuth()

  const [checked, setChecked] = useState('male')
  const [intrests, setIntrests] = useState([])

  useEffect(() => {
    if (userProfile.intrests.length)
      setIntrests(userProfile.intrests)
  }, [user, userProfile])

  const deleteImage = (image) => {
    const fileRef = firebase.storage().refFromURL(image)

    fileRef.delete()
      .then(() => {
        firebase.firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            avatar: firebase.firestore.FieldValue.arrayRemove(image)
          })
          .then(() => {
            getUserProfile(user)
          })
      })
  }

  useEffect(() =>
    setChecked(userProfile.gender ? userProfile.gender : "male")
    , [userProfile])

  const maleGender = async () => {
    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        gender: "male"
      }).then(() => {
        setChecked("male")
        getUserProfile(user)
      })
  }

  const femaleGender = async () => {
    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .update({
        gender: "female"
      }).then(() => {
        setChecked("female")
        getUserProfile(user)
      })
  }

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
      <Bar />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          style={_const.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name='chevron-left' color={color.dark} size={30} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 10,
            fontSize: 18,
            fontFamily: "text"
          }}
        >
          Edit profile
        </Text>
      </View>

      <ScrollView>
        <View>
          <View style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
            paddingHorizontal: 10
          }}>
            <FlatGrid
              itemDimension={100}
              data={userProfile.avatar}
              renderItem={({ item: image }) => (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap"
                  }}
                >
                  <View
                    style={{
                      position: "relative",
                      width: "100%",
                      height: 150,
                      backgroundColor: color.offWhite,
                      borderRadius: 12,
                      overflow: "hidden"
                    }}
                  >
                    <Image
                      source={{ uri: image }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        flex: 1,
                        width: "100%",
                        height: "100%"
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => deleteImage(image)}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: color.white,
                        borderRadius: 50,
                        shadowColor: color.dark,
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <MaterialCommunityIcons name='close' color={color.red} size={22} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>

          {
            userProfile.avatar.length != 9 &&
            <View style={{ paddingHorizontal: 10 }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: color.red,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: color.white,
                    fontSize: 18,
                    fontFamily: "text"
                  }}
                >
                  Add Photo
                </Text>
              </TouchableOpacity>
            </View>
          }

          <View style={editProfile.form}>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>About Me</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditAbout")} style={editProfile.input} >
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>{userProfile.about}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Username</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditUsername")} style={editProfile.input} >
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>oymo.me/@{userProfile.username}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Name</Text>
              <TouchableWithoutFeedback style={editProfile.input} onPress={() => navigation.navigate("EditName")}>
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>{userProfile.name}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Passion</Text>
              <TouchableWithoutFeedback style={editProfile.input} onPress={() => navigation.navigate("EditPassion")}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start"
                  }}
                >
                  {
                    intrests.map(passion => {
                      return (
                        <View
                          style={{
                            backgroundColor: color.white,
                            borderWidth: 1,
                            borderColor: color.red,
                            borderRadius: 50,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            marginRight: 5
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "text",
                              color: color.red,
                              fontSize: 10
                            }}
                          >
                            {passion}
                          </Text>
                        </View>
                      )
                    })
                  }
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Job Title</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditJob')} style={editProfile.input} >
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>{userProfile.occupation}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Company</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditCompany')} style={editProfile.input} >
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>{userProfile.company}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>School</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditSchool')} style={editProfile.input} >
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>{userProfile.school}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Location</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditAddress')} style={editProfile.input} >
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>{userProfile.address?.city}, {userProfile.address?.country}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Gender</Text>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="male"
                    color={color.red}
                    status={checked === 'male' ? 'checked' : 'unchecked'}
                    onPress={maleGender}
                  />
                  <Text
                    style={{
                      fontFamily: "text"
                    }}
                  >
                    Male
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="female"
                    color={color.red}
                    status={checked === 'female' ? 'checked' : 'unchecked'}
                    onPress={femaleGender}
                  />
                  <Text
                    style={{
                      fontFamily: "text"
                    }}
                  >
                    Female
                  </Text>
                </View>
              </View>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: color.labelColor, fontFamily: "text" }}>Birthday</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditDateOfBirth')} style={editProfile.input} >
                <Text style={{ paddingTop: 6, fontFamily: "text" }}>{userProfile.date}</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile