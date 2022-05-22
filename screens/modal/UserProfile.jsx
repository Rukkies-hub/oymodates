import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  Pressable
} from 'react-native'

import Header from '../../components/Header'
import Bar from '../../components/StatusBar'
import color from '../../style/color'
import { useFonts } from 'expo-font'
import { Feather, Fontisto, AntDesign } from '@expo/vector-icons'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import AutoHeightImage from 'react-native-auto-height-image'

const { width, height } = Dimensions.get('window')
const UserProfile = (params) => {
  const currentUser = params?.route?.params?.user

  const [reels, setReels] = useState([])

  useEffect(() =>
    onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', currentUser?.id)),
      snapshot => setReels(
        snapshot.docs.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      ))
    , [currentUser, db])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar color={'dark'} />
      <Header showBack showTitle title={currentUser?.displayName} showAratar />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 20
        }}
      >
        <Image
          source={{ uri: currentUser?.photoURL }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 100
          }}
        />

        <View
          style={{
            flex: 1,
            paddingLeft: 20,
            justifyContent: 'center'
          }}
        >
          {
            currentUser?.username &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: color.dark,
                  fontFamily: 'boldText',
                  fontSize: 20
                }}
              >
                {currentUser?.username}
              </Text>
              <Text
                style={{
                  color: color.dark,
                  fontFamily: 'boldText',
                  fontSize: 20,
                  marginLeft: 10
                }}
              >
                {currentUser?.age}
              </Text>
            </View>
          }

          <Text
            style={{
              fontFamily: 'text'
            }}
          >
            {currentUser?.displayName}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginHorizontal: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: color.black
            }}
          >
            16
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.lightText,
              marginLeft: 5
            }}
          >
            Following
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginHorizontal: 20
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: color.black
            }}
          >
            12
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.lightText,
              marginLeft: 5
            }}
          >
            Followers
          </Text>
        </View>

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
              fontSize: 18,
              color: color.black
            }}
          >
            55
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.lightText,
              marginLeft: 5
            }}
          >
            Likes
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 20
        }}
      >
        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: color.dark
          }}
        >
          {currentUser?.about}
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Feather name='home' size={14} color={color.dark} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.dark,
              marginLeft: 5
            }}
          >
            Lives in
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: color.dark,
              marginLeft: 5
            }}
          >
            {currentUser?.city}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Fontisto name="date" size={14} color={color.dark} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: color.dark,
              marginLeft: 5
            }}
          >
            Joined
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: color.dark,
              marginLeft: 5
            }}
          >
            {currentUser?.timestamp?.toDate().toDateString()}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Feather name="briefcase" size={14} color={color.dark} />

        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: color.dark,
            marginLeft: 10
          }}
        >
          {currentUser?.job} at {currentUser?.company}
        </Text>
      </View>

      <ScrollView>
        {
          reels?.length > 0 &&
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              marginTop: 20
            }}
          >
            {
              reels.map((reel, index) => (
                <Pressable
                  key={index}
                  onPress={() => console.log('reel: ', reel)}
                  style={{
                    width: '30%',
                    height: (width - 10) / 3,
                    margin: 3
                  }}
                >
                  <AutoHeightImage
                    source={{ uri: reel?.thumbnail }}
                    width={width / 3}
                    style={{
                      flex: 1
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      margin: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      backgroundColor: color.faintBlack,
                      padding: 10,
                      borderRadius: 50
                    }}
                  >
                    <AntDesign name="heart" size={18} color={color.white} />
                    <Text
                      style={{
                        fontFamily: 'boldText',
                        marginLeft: 10,
                        color: color.white,
                        fontSize: 18
                      }}
                    >
                      {reel?.likes?.length}
                    </Text>
                  </View>
                </Pressable>
              ))
            }
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserProfile