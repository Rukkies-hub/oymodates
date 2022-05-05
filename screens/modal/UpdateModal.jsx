import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native'

import Header from '../../components/Header'
import color from '../../style/color'
import useAuth from '../../hooks/useAuth'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useFonts } from 'expo-font'

import DatePicker from "react-native-datepicker"

import * as ImagePicker from 'expo-image-picker'

import moment from 'moment'

import { useNavigation } from '@react-navigation/native'

import { db } from '../../hooks/firebase'
import { serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage"

const UpdateModal = () => {
  const { user, logout, userProfile } = useAuth()
  const storage = getStorage()
  const navigation = useNavigation()

  const [date, setDate] = useState()
  const [job, setJob] = useState('')
  const [image, setImage] = useState(null)

  const incompleteForm = !date || !job

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.cancelled) {
      // setImage(result.uri)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => {
          resolve(xhr.response)
        }

        xhr.responseType = "blob"
        xhr.open("GET", result.uri, true)
        xhr.send(null)
      })

      const photoRef = ref(storage, `avatars/${new Date().toISOString()}`)

      const uploadTask = uploadBytesResumable(photoRef, blob)

      uploadTask.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL)
          })
        })
    }
  }

  const updateUserProfile = () => {
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image ? image : null,
      job,
      age: moment().diff(moment(date, "DD-MM-YYYY"), "years"),
      ageDate: date,
      timestamp: serverTimestamp()
    })
      .then(() => navigation.goBack())
      .catch(error => alert(error.message))
  }

  const [loaded] = useFonts({
    logo: require('../../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showTitle showAratar showBack title={`Welcome, ${user.displayName}`} />

      <ScrollView>
        <View
          style={{
            padding: 10,
            position: 'relative'
          }}
        >
          <Image
            style={{
              width: '100%',
              height: 400,
              borderRadius: 12
            }}
            source={{ uri: image ? image : userProfile?.photoURL || user.photoURL }}
          />
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              bottom: -10,
              right: 20,
              height: 50,
              zIndex: 1
            }}
          >
            <TouchableOpacity
              onPress={logout}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.red,
                borderRadius: 50,
                marginRight: 10
              }}
            >
              <MaterialCommunityIcons name='cog' size={28} color={color.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.red,
                borderRadius: 50
              }}
            >
              <MaterialCommunityIcons name='pencil' size={28} color={color.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 10
          }}
        >
          <DatePicker
            style={{
              width: "100%",
            }}
            date={date}
            mode="date"
            placeholder="Age"
            format="DD/MM/YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                right: -5,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                borderColor: "gray",
                alignItems: "flex-start",
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: color.borderColor,
                height: 45
              },
              placeholderText: {
                fontSize: 16,
                fontFamily: "text"
              },
              dateText: {
                fontSize: 16,
              }
            }}
            onDateChange={setDate}
          />

          <TextInput
            placeholder='Enter your occupation'
            value={job}
            onChangeText={text => setJob(text)}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor,
              height: 45,
              fontFamily: 'text',
              marginTop: 20
            }}
          />

          <TouchableOpacity
            onPress={updateUserProfile}
            disabled={incompleteForm}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 20,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: incompleteForm ? color.labelColor : color.red
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                color: color.white
              }}
            >
              Update Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default UpdateModal