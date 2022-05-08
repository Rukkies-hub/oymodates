import { useNavigation } from '@react-navigation/native'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

import Header from '../../components/Header'
import { db } from '../../hooks/firebase'
import useAuth from '../../hooks/useAuth'

import color from '../../style/color'

const passionList = [
  "karaoke",
  "cycling",
  "swimming",
  "cat lover",
  "dog lover",
  "environmentalism",
  "running",
  "outdoors",
  "trivia",
  "grap a drink",
  "museum",
  "gammer",
  "soccer",
  "netflix",
  "sports",
  "working out",
  "comedy",
  "spirituality",
  "board games",
  "cooking",
  "wine",
  "foodie",
  "hiking",
  "politics",
  "writer",
  "travel",
  "golf",
  "reading",
  "movies",
  "athlete",
  "baking",
  "plant-based",
  "vlogging",
  "gardening",
  "fishing",
  "art",
  "brunch",
  "climbing",
  "tea",
  "walking",
  "blogging",
  "volunteering",
  "astrology",
  "yoga",
  "instagram",
  "language exchange",
  "surfing",
  "craft beer",
  "shopping",
  "DIY",
  "dancing",
  "disney",
  "fashion",
  "music",
  "photography",
  "picnicking",
  "coffie"
]

const Passion = () => {
  const navigation = useNavigation()

  const { user, passions, setPassions } = useAuth()

  const [passionsLoading, setPassionLoading] = useState(false)

  const updateIntrests = () => {
    if (passions?.length >= 3) {
      setPassionLoading(true)
      updateDoc(doc(db, 'users', user.uid), {
        passions
      }).finally(() => {
        setPassionLoading(false)
        navigation.goBack()
      })
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Header showBack showTitle title='Select Passion' />

      <Text
        style={{
          fontSize: 16,
          marginVertical: 20,
          marginHorizontal: 10
        }}
      >
        Select passions that you'd like to share with the people you connect with. Choose a minimum of 3.
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: color.dark,
            fontFamily: "text"
          }}
        >
          Edit Passions
        </Text>
        {
          passions?.length > 0 &&
          <Text
            style={{
              fontFamily: 'text',
              color: color.dark,
              fontSize: 20
            }}
          >
            {passions?.length}/5
          </Text>
        }
      </View>

      <View
        style={{
          flex: 1,
          width: "100%",
          paddingHorizontal: 10,
          marginTop: 30,
          paddingBottom: 20
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            marginBottom: 20
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }}
          >
            {
              passionList.map((pashion, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (passions.includes(pashion))
                        setPassions(passions.filter(item => item !== pashion))
                      else if (passions.length <= 4)
                        setPassions(oldArray => [...oldArray, pashion])
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderWidth: 2,
                      borderRadius: 50,
                      borderColor: passions?.includes(pashion) ? color.blue : color.borderColor,
                      marginBottom: 10,
                      marginRight: 10
                    }}
                  >
                    <Text
                      style={{
                        color: passions?.includes(pashion) ? color.blue : color.lightText,
                        fontSize: 12,
                        fontFamily: "text",
                        textTransform: "capitalize"
                      }}
                    >
                      {pashion}
                    </Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </ScrollView>

        <TouchableOpacity
          disabled={passions?.length < 3}
          onPress={updateIntrests}
          style={{
            backgroundColor: passions?.length >= 3 ? color.blue : color.labelColor,
            height: 50,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {
            passionsLoading ?
              <ActivityIndicator size="small" color={color.white} />
              :
              <Text
                style={{
                  color: color.white,
                  fontSize: 18,
                  fontFamily: "text"
                }}
              >
                Update passion
              </Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Passion