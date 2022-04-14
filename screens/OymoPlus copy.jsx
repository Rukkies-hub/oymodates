import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native'

import color from "../style/color"

const AccountUpgrade = () => {
  const [email, setEmail] = useState("")
  const [cardDetails, setCardDetails] = useState("")
  const { confirmPayment, loading } = useConfirmPayment()

  const fetchPaymentIntentClientSecrete = async () => {
    const response = await fetch("http://192.168.43.97:3000/createPaymentIntent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const { clientSecret, error } = await response.json()
    return { clientSecret, error }
  }

  const handlePay = async () => {
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter complete card details and Email")
      return
    }

    const billingDetails = {
      email: email
    }

    try {
      const { clientSecret, error } = await
        fetchPaymentIntentClientSecrete()
      if (error)
        console.log("Unable to process payment")
      else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails: billingDetails
        })
        if (error) {
          alert(`Payment Confermation Error ${error.message}`)
        }
        else if (paymentIntent) {
          alert("Payment Successful")
          console.log("Payment successful ", paymentIntent)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.transparentBackground,
        justifyContent: "center",
        paddingHorizontal: 10
      }}
    >
      <View
        style={{
          backgroundColor: color.white,
          padding: 20,
          borderRadius: 20
        }}
      >
        <TextInput
          autoCapitalize='none'
          keyboardType="email-address"
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: color.borderColor,
            borderRadius: 12,
            paddingHorizontal: 10
          }}
        />
        <CardField
          postalCodeEnabled={true}
          placeholder="4242 4242 4242 4242"
          style={{
            height: 50,
            marginTop: 20,
            borderWidth: 1,
            borderColor: color.borderColor,
            borderRadius: 12,
            paddingHorizontal: 10,
          }}
          onCardChange={cardDetails => {
            setCardDetails(cardDetails)
          }}
        />
        <TouchableOpacity
          onPress={handlePay}
          disabled={loading}
          style={{
            height: 50,
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color.dark,
            borderRadius: 12
          }}
        >
          <Text
            style={{
              color: color.white,
            }}
          >
            Pay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AccountUpgrade