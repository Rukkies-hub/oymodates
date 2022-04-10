import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView
} from 'react-native'
import React from 'react'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import editProfile from '../style/editProfile'

import Bar from "./StatusBar"

import useAuth from "../hooks/useAuth"
import { FlatGrid } from 'react-native-super-grid'

import firebase from '../hooks/firebase'

const EditProfile = ({ navigation }) => {
  const { userProfile, user, pickImage, getUserProfile } = useAuth()

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff"
      }}
    >
      <Bar />
      <View style={editProfile.header}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name='chevron-left' color="#000" size={30} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 18
            }}
          >
            Edit profile
          </Text>
        </View>
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
                      backgroundColor: "#F0F2F5",
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
                        backgroundColor: "#fff",
                        borderRadius: 50,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <MaterialCommunityIcons name='close' color="#FF4757" size={22} />
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
                  backgroundColor: "#FF4757",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          }

          <View style={editProfile.form}>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Username</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditUsername")} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.username}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Name</Text>
              <TouchableWithoutFeedback style={editProfile.input} onPress={() => navigation.navigate("EditName")}>
                <Text style={editProfile.inputText}>{userProfile.name}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Phone number</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditPhone")} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.phone}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Gender</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("EditGender")} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.gender}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Birthday</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditDateOfBirth')} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.date}</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={editProfile.inputField}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Occupation</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('EditJob')} style={editProfile.input} >
                <Text style={editProfile.inputText}>{userProfile.job}</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile