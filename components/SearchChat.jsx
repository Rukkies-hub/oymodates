import React from 'react'
import { View, Text, TextInput } from 'react-native'
import useAuth from '../hooks/useAuth'
import color from '../style/color'

import { Entypo } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'

const SearchChat = () => {
  const { user, userProfile, search, setSearch, matches, setMatchesFilter } = useAuth()

  const searchFilter = text => {
    if (text) {
      const newData = matches.filter(item => {
        const itemData = getMatchedUserInfo(item?.users, user?.uid == undefined ? user?.user?.uid : user?.uid)?.username ?
          getMatchedUserInfo(item?.users, user?.uid == undefined ? user?.user?.uid : user?.uid)?.username?.toUpperCase() :
          ''.toUpperCase()

        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      setMatchesFilter(newData)
      setSearch(text)
    } else {
      setMatchesFilter(matches)
      setSearch(text)
    }
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        height: 40,
        backgroundColor: userProfile?.theme == 'dark' ? color.dark : color.offWhite,
        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        paddingHorizontal: 10
      }}
    >
      <Entypo name='magnifying-glass' size={24} color={userProfile?.theme == 'dark' ? color.white : color.lightText} />
      <TextInput
        value={search}
        placeholder='Search'
        onChangeText={text => searchFilter(text)}
        placeholderTextColor={userProfile?.theme == 'dark' ? color.white : color.lightText}
        style={{
          flex: 1,
          marginLeft: 10,
          fontFamily: 'text',
          color: userProfile?.theme == 'dark' ? color.white : color.dark
        }}
      />
    </View>
  )
}

export default SearchChat