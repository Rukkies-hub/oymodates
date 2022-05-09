import React, { useState, useEffect } from 'react'
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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import moment from 'moment'

import { useFonts } from 'expo-font'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import useAuth from '../../hooks/useAuth'

const UserProfile = (params) => {
  const { passions } = useAuth()
  const currentUser = params?.route?.params?.user

  const [user, setUser] = useState(null)

  useEffect(async () => {
    let profile = await (await getDoc(doc(db, 'users', currentUser.id))).data()
    setUser(profile)
  }, [currentUser])

  console.log('profile: ', user)

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
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
      <Header showBack showTitle title={currentUser?.displayName} />
      <ScrollView>
        <View
          style={{
            padding: 10
          }}
        >
          <Image
            style={{
              width: '100%',
              height: 400,
              borderRadius: 12
            }}
            source={{ uri: user?.photoURL }}
          />
        </View>

        <View
          style={{
            marginTop: 30,
            paddingHorizontal: 10
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontFamily: 'boldText',
                color: color.dark,
                fontSize: 30,
                marginRight: 10
              }}
            >
              {user?.displayName}
            </Text>
            <Text
              style={{
                color: color.dark,
                fontSize: 30
              }}
            >
              {user?.age}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <MaterialCommunityIcons name='briefcase-variant-outline' size={20} color={color.labelColor} />
            <Text
              style={{
                fontFamily: 'text',
                color: color.lightText,
                fontSize: 18
              }}
            >
              {` ${user?.job}`}
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                color: color.lightText,
                fontSize: 18
              }}
            >
              at
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                color: color.lightText,
                fontSize: 18
              }}
            >
              {user?.company}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <MaterialCommunityIcons name='home-outline' size={20} color={color.labelColor} />
            <Text
              style={{
                fontFamily: 'text',
                color: color.lightText,
                fontSize: 18,
                marginLeft: 6
              }}
            >
              Lives in
            </Text>
            <Text
              style={{
                fontFamily: 'text',
                color: color.lightText,
                fontSize: 18
              }}
            >
              {` ${user?.city}`}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <MaterialCommunityIcons name='account-outline' size={20} color={color.labelColor} />
            <Text
              style={{
                fontFamily: 'text',
                color: color.lightText,
                fontSize: 18
              }}
            >
              {` ${user?.gender}`}
            </Text>
          </View>

          <View
            style={{
              marginVertical: 20,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: color.borderColor,
              borderBottomWidth: 1,
              borderBottomColor: color.borderColor
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                fontSize: 16,
                color: color.lightText
              }}
            >
              {user?.about}
            </Text>
          </View>

          <View
            style={{
              marginTop: 10
            }}
          >
            <Text
              style={{
                fontFamily: 'boldText',
                fontSize: 20,
                marginBottom: 20
              }}
            >
              Passions
            </Text>
            <View
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              {
                passions.map((passion, index) => {
                  return (
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderWidth: 2,
                        borderRadius: 50,
                        borderColor: color.borderColor,
                        marginBottom: 10,
                        marginRight: 10
                      }}
                    >
                      <Text
                        style={{
                          color: color.lightText,
                          fontSize: 12,
                          fontFamily: "text",
                          textTransform: "capitalize"
                        }}
                      >
                        {passion}
                      </Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default UserProfile