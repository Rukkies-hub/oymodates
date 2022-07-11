import React, { useLayoutEffect, useEffect } from 'react'
import { View, SafeAreaView } from 'react-native'
import color from '../style/color'

import { useFonts } from 'expo-font'
import Posts from '../components/Posts'

import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'

const Feeds = () => {
  const { user, profiles, setProfiles, userProfile } = useAuth()
  const navigation = useNavigation()

  useLayoutEffect(() =>
    onSnapshot(doc(db, 'users', user?.uid),
      snapshot => {
        if (!snapshot?.exists()) navigation.navigate('EditProfile', { setup: true })
      })
    , [])

  useEffect(() => {
    let unsub

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, 'users', user?.uid, 'passes'))
        .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

      const passeedUserIds = (await passes).length > 0 ? passes : ['test']

      const swipes = await getDocs(collection(db, 'users', user?.uid, 'swipes'))
        .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

      const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

      unsub =
        onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
          snapshot => {
            setProfiles(
              snapshot?.docs?.filter(doc => doc?.id !== user?.uid)
                .map(doc => ({
                  id: doc?.id,
                  ...doc?.data()
                }))
            )
          })
    }

    fetchCards()
    return unsub
  }, [db])

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white,
      }}
    >
      <Posts />
    </SafeAreaView>
  )
}

export default Feeds