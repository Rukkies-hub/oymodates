import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { PayWithFlutterwave } from 'flutterwave-react-native'

import { publicKey, email } from '@env'
import color from '../../../style/color'
import { useFonts } from 'expo-font'

import uuid from 'uuid-random'

const Payment = () => {

  const handleOnRedirect = () => {
    console.log('tx_ref: ', tx_ref)
  }

  const generateRef = (length) => {
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
      var j = (Math.random() * (a.length - 1)).toFixed(0);
      b[i] = a[j];
    }
    return b.join("");
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View
      style={{
        marginTop: 20
      }}
    >
      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        style={{
          backgroundColor: 'red'
        }}
        options={{
          tx_ref: uuid(),
          authorization: publicKey,
          customer: {
            email: 'rukkiecodes2@gmail.com'
          },
          amount: 5,
          currency: 'USD',
          payment_options: 'card'
        }}
        customButton={(props) => (
          <TouchableOpacity
            style={{
              backgroundColor: color.goldDark,
              height: 50,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={props.onPress}
            isBusy={props.isInitializing}
            disabled={props.disabled}>
            <Text
              style={{
                color: color.white,
                fontFamily: 'boldText',
                fontSize: 18
              }}
            >
              Pay $5
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default Payment