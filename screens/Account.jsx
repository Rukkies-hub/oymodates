import { View, Text, SafeAreaView, Image, TouchableOpacity, TouchableWithoutFeedback, Button } from 'react-native'
import React, { useRef } from 'react'

import RBSheet from "react-native-raw-bottom-sheet";

import Bar from "./StatusBar"

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import account from "../style/account"
import editProfile from '../style/editProfile'

import useAuth from "../hooks/useAuth"

const Account = ({ navigation }) => {
  const { userProfile, logout } = useAuth()

  const refRBSheet = useRef();

  return (
    <SafeAreaView style={account.container}>
      <Bar />
      <View style={account.header}>

        <Text style={account.username}>{userProfile.username}</Text>


        <View style={account.headerActions}>
          <TouchableOpacity style={account.headerActionsButton}>
            <SimpleLineIcons name="plus" color="rgba(0,0,0,0.8)" size={23} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => refRBSheet.current.open()} style={account.headerActionsButton}>
            <SimpleLineIcons name="menu" color="rgba(0,0,0,0.8)" size={23} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={account.detail}>
        <View style={account.state}>
          <TouchableWithoutFeedback style={account.avatar}>
            <Image
              style={editProfile.avatarImage}
              source={userProfile.avatar ? { uri: userProfile.avatar } : require('../assets/pph.jpg')}
            />
          </TouchableWithoutFeedback>

          <View style={account.detailCount}>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>0</Text>
              <Text style={account.numberTitle}>Posts</Text>
            </View>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>0</Text>
              <Text style={account.numberTitle}>Followers</Text>
            </View>
            <View style={account.detailCountInfo}>
              <Text style={account.number}>0</Text>
              <Text style={account.numberTitle}>Following</Text>
            </View>
          </View>
        </View>
        <View style={account.about}>
          <Text>{userProfile.bio}</Text>
        </View>
      </View>

      <View style={account.action}>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={account.actionEditProfile}>
          <Text>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={account.explor}>
          <MaterialCommunityIcons name="account-plus" color="rgba(0,0,0,0.8)" size={23} />
        </TouchableOpacity>
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeDuration={300}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "#000"
          },
          container: {
            paddingHorizontal: 10,
          }
        }}
      >
        <TouchableOpacity style={account.sheetsButton}>
          <SimpleLineIcons name="settings" color="#000" style={{ marginLeft: 10 }} size={23} />
          <Text style={account.sheetsSheetsButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={account.sheetsLogout}>
          <SimpleLineIcons name="logout" color="#FF4757" style={{ marginLeft: 10 }} size={23} />
          <Text style={account.sheetsLogoutText}>Logout</Text>
        </TouchableOpacity>
      </RBSheet>
    </SafeAreaView>
  )
}

export default Account