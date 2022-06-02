import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Pressable, ScrollView } from 'react-native'

import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { db } from '../../../hooks/firebase'
import useAuth from '../../../hooks/useAuth'
import AutoHeightImage from 'react-native-auto-height-image'
import color from '../../../style/color'

const { width, height } = Dimensions.get('window')
import { AntDesign } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

const MyReels = () => {
  const { user } = useAuth()
  const [reels, setReels] = useState([])

  useEffect(() =>
    onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', user?.uid)),
      snapshot => setReels(
        snapshot.docs.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      ))
    , [user, db])

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <ScrollView>
      {
        reels?.length > 0 &&
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: 20
          }}
        >
          {
            reels.map((reel, index) => (
              <Pressable
                key={index}
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
  )
}

export default MyReels