import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation()

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 45,
      paddingHorizontal: 10
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center"
        }}
          onPress={() => navigation.goBack()}>
          <SimpleLineIcons name="arrow-left" color="#000" size={20} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10, color: "#000" }}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <SimpleLineIcons name="phone" color="#000" size={20} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Header