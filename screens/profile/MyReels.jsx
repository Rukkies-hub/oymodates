import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Pressable, ScrollView, Image } from 'react-native'

import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { db } from '../../hooks/firebase'
import useAuth from '../../hooks/useAuth'
import AutoHeightImage from 'react-native-auto-height-image'
import color from '../../style/color'

const { width, height } = Dimensions.get('window')
import { AntDesign } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import { FlatGrid } from 'react-native-super-grid'

const MyReels = () => {
  const { user } = useAuth()
  const navigation = useNavigation()

  const [reels, setReels] = useState([])

  useEffect(() =>
    (() => {
      onSnapshot(query(collection(db, 'reels'),
        where('user.id', '==', user?.uid)),
        snapshot => setReels(
          snapshot.docs.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        ))
    })()
    , [user, db])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
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
          <FlatGrid
            data={reels}
            keyExtractor={item => item.id}
            itemDimension={100}
            showsVerticalScrollIndicator={false}
            additionalRowStyle={{
              padding: 0,
              margin: 0,
              marginLeft: -15
            }}
            itemContainerStyle={{
              padding: 0,
              margin: 5,
              marginTop: -12
            }}
            renderItem={({ item: reel }) => (
              <Pressable
                onPress={() => navigation.navigate('ViewReel', { reel })}
                style={{
                  width: '100%',
                  height: width / 3
                }}
              >
                <Image
                  source={{ uri: reel?.thumbnail }}
                  width={width / 3}
                  style={{ flex: 1 }}
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
                    padding: 5,
                    borderRadius: 50,
                    minWidth: 45
                  }}
                >
                  <AntDesign name="heart" size={14} color={color.white} />
                  <Text
                    style={{
                      fontFamily: 'boldText',
                      marginLeft: 10,
                      color: color.white,
                      fontSize: 14
                    }}
                  >
                    {reel?.likesCount}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      }
    </ScrollView>
  )
}

export default MyReels