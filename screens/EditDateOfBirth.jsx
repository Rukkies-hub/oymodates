import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import DatePicker from 'react-native-datepicker';

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Bar from "./StatusBar"

import editProfile from '../style/editProfile'

import useAuth from "../hooks/useAuth"

const EditDateOfBirth = () => {
  const { updateDateState, updateDateOfBirth } = useAuth()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={editProfile.container}>
      <Bar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <View style={editProfile.header}>
            <View style={editProfile.left}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SimpleLineIcons name="arrow-left" color="rgba(0,0,0,0.8)" size={20} />
              </TouchableOpacity>
              <Text style={editProfile.headText}>Date of birth</Text>
            </View>
            <TouchableOpacity onPress={updateDateOfBirth}>
              <MaterialCommunityIcons name="check" color="#4169e1" size={24} />
            </TouchableOpacity>
          </View>

          <View style={editProfile.form}>
            <View style={{
              height: 45,
              marginBottom: 30,
              position: "relative"
            }}>
              <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Select Date of birth</Text>
              <DatePicker
                style={{
                  width: "100%",
                }}
                date={updateDateState.date}
                mode="date"
                placeholder="select date"
                format="DD/MM/YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    right: -5,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    borderColor: "gray",
                    alignItems: "flex-start",
                    borderWidth: 0,
                    borderBottomWidth: 1,
                  },
                  placeholderText: {
                    fontSize: 16,
                    color: "gray"
                  },
                  dateText: {
                    fontSize: 16,
                  }
                }}
                onDateChange={(date) => {
                  updateDateState.setDate(date);
                }}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default EditDateOfBirth