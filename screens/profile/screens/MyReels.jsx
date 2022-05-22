import React, { useEffect, useState } from 'react'
import { View, Text, Image, Dimensions, Pressable } from 'react-native'

import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { FlatGrid } from 'react-native-super-grid'
import { db } from '../../../hooks/firebase'
import useAuth from '../../../hooks/useAuth'
import AutoHeightImage from 'react-native-auto-height-image'
import { Video } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'
import color from '../../../style/color'

const { width, height } = Dimensions.get('window')
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

const MyReels = () => {
  const { user } = useAuth()
  const video = React.useRef(null)
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
    , [])

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <>
      {
        reels?.length > 0 &&
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 20
          }}
        >
          {
            reels.map((reel, index) => (
              <Pressable
                onPress={() => console.log('reel: ', reel)}
                style={{
                  width: width / 3,
                  height: width / 3
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
    </>
  )
}

export default MyReels