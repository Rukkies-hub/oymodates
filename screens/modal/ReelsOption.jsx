import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import React from 'react'
import color from '../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'
import useAuth from '../../hooks/useAuth'
import { Feather } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const ReelsOption = () => {
  const { userProfile, theme } = useAuth()
  const navigation = useNavigation()
  const { reel } = useRoute().params

  const deleteReel = async () => {
    navigation.goBack()
    await deleteDoc(doc(db, 'reels', reel?.id))
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flex: 1,
          width: '100%'
        }}
      />
      <View
        style={{
          minWidth: Dimensions.get('window').width,
          backgroundColor: theme == 'dark' ? color.black : color.white,
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}
      >
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 10,
            backgroundColor: theme == 'dark' ? color.dark : color.offWhite,
            borderRadius: 12,
            paddingBottom: 10
          }}
        >
          <Image
            source={{ uri: reel?.thumbnail }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              marginRight: 10
            }}
          />

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                color: theme == 'dark' ? color.white : color.black,
                fontSize: 18
              }}
            >
              {reel?.description}
            </Text>

            <Text
              style={{
                color: theme == 'dark' ? color.white : color.dark,
                fontSize: 13
              }}
            >
              Video - {userProfile?.username}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={deleteReel}
          activeOpacity={0.5}
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.red,
            borderRadius: 12
          }}
        >
          <Feather name='trash-2' size={20} color={color.white} />
          <Text
            style={{
              fontFamily: 'text',
              color: color.white,
              marginLeft: 10
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ReelsOption