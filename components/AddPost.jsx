import React from 'react'
import { View, Text, Pressable } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useFonts } from 'expo-font'

import color from '../style/color'
import { useNavigation } from '@react-navigation/native'

const AddPost = () => {
  const navigation = useNavigation()

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: color.borderColor,
        paddingHorizontal: 10,
        marginTop: 10
      }}
    >
      <Pressable
        onPress={() => navigation.navigate('Add')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 50
        }}
      >
        <Text
          style={{
            fontFamily: 'text',
            color: color.lightText
          }}
        >
          What's on your mind...
        </Text>
      </Pressable>
      <Pressable
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10
        }}
      >
        <FontAwesome5 name='image' size={18} color={color.blue} />
      </Pressable>
    </View>
  )
}

export default AddPost