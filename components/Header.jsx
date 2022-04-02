import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation()

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 45,
      paddingHorizontal: 15,
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SimpleLineIcons name="arrow-left" color="#FF4757" size={20} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10, color: "#000" }}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity>
          <SimpleLineIcons name="phone" color="#FF4757" size={20} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Header