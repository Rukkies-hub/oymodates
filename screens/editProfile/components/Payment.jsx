import { View, Text } from 'react-native'
import React from 'react'
// import Rave from 'react-native-rave-webview'
import Rave from '.'
import uuid from 'uuid-random'

import { publicKey } from '@env'
import color from '../../../style/color'
import { useFonts } from 'expo-font'
import useAuth from '../../../hooks/useAuth'

const Payment = () => {
  const { userProfile } = useAuth()

  const onSuccess = (data) => {
    console.log('success', data)
    // You can get the transaction reference from successful transaction charge response returned and handle your transaction verification here
  }

  const onCancel = () => {
    console.log('error', 'Transaction was Cancelled!')
  }

  const onError = () => {
    // an error occoured
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View style={{ marginTop: 20 }}>
      <Rave
        buttonText='Pay Now'
        raveKey={publicKey}
        amount={5}
        billingEmail='ayoshokz@gmail.com'
        billingName={userProfile?.displayName}
        ActivityIndicatorColor='green'
        onCancel={() => this.onCancel()}
        onSuccess={transactionRef => this.onSuccess(transactionRef)}
        btnStyles={{
          backgroundColor: color.goldDark,
          width: '100%',
          height: 50,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        textStyles={{
          color: color.white,
          alignSelf: 'center',
          fontFamily: 'boldText'
        }}
        onError={() => {
          alert('something went wrong')
        }}
        txref={uuid()}
      />
    </View>
  )
}

export default Payment