import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/core'

const Match = () => {
  const navigation = useNavigation()
  const { params } = useRoute()

  const { userProfile, userSwiped } = params
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#FF4757",
      opacity: 0.89,
      padding: 20,
      justifyContent: "center"
    }}>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Image
          style={{ width: "100%", height: 80 }}
          source={{ uri: "https://links.papareact.com/mg9" }}
        />
      </View>

      <Text style={{ color: "#fff", textAlign: "center", marginTop: 50, fontSize: 18 }}>
        You and {userSwiped.username } have liked each other.
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 50 }}>
        <Image style={{
          width: 100,
          height: 100,
          borderRadius: 50
        }} source={{ uri: userSwiped.avatar }} />
        <Image style={{
          width: 100,
          height: 100,
          borderRadius: 50
        }} source={{ uri: userProfile.avatar }} />
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.goBack()
          navigation.navigate("Chat")
        }}
        style={{
          backgroundColor: "#fff",
          borderRadius: 50,
          height: 70,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50
        }}>
        <Text style={{ color: "#000", fontSize: 20 }}>Send a message</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Match