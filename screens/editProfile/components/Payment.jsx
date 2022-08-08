import { View, Text, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import color from '../../../style/color'
import { useFonts } from 'expo-font'
import AutoHeightImage from 'react-native-auto-height-image'

import SelectDropdown from 'react-native-select-dropdown'

const { width } = Dimensions.get('window')

import currency_code from './currencies'
import axios from 'axios'

const Payment = () => {
  const { user, userProfile } = useAuth()
  const [name, setName] = useState(userProfile?.displayName)
  const [accountNumber, setAccountNumber] = useState('')
  const [currency, setCurrency] = useState('')
  const [email, setEmail] = useState(user?.email)
  const [phone, setPhone] = useState(userProfile?.phone)
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)

  const makePayment = async () => {
    setLoading(true)
    const response = await axios({
      method: 'post',
      url: 'https://oymo.herokuapp.com',
      data: {
        account_bank: '070',
        account_number: accountNumber,
        currency,
        email,
        phone_number: phone,
        fullname: name
      }
    })
    setLoading(false)
    console.log('response: ', response)
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.faintBlack,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          width: width - 20,
          minHeight: 1,
          overflow: 'hidden',
          borderRadius: 20,
          backgroundColor: color.white,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              marginRight: 10
            }}
          >
            Payment secured by
          </Text>
          <AutoHeightImage
            source={require('../../../assets/fw.png')}
            width={100}
          />
        </View>
        <TextInput
          placeholder='Account name'
          placeholderTextColor={color.dark}
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: color.offWhite,
            width: '100%',
            height: 50,
            fontFamily: 'text',
            color: color.dark,
            fontSize: 16,
            borderRadius: 8,
            paddingHorizontal: 10
          }}
        />
        <TextInput
          placeholder='Account number'
          placeholderTextColor={color.dark}
          value={accountNumber}
          onChangeText={setAccountNumber}
          style={{
            backgroundColor: color.offWhite,
            width: '100%',
            height: 50,
            fontFamily: 'text',
            color: color.dark,
            fontSize: 16,
            borderRadius: 8,
            marginTop: 10,
            paddingHorizontal: 10
          }}
        />

        <View
          style={{
            backgroundColor: color.offWhite,
            width: '100%',
            height: 50,
            borderRadius: 8,
            marginTop: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: color.dark,
              fontSize: 16
            }}
          >
            Currency
          </Text>
          <SelectDropdown
            data={currency_code}
            buttonStyle={{
              backgroundColor: color.transparent
            }}
            buttonTextStyle={{
              fontFamily: 'text',
              color: color.dark,
              fontSize: 14
            }}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
            }}
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            rowTextForSelection={(item, index) => item}
          />
        </View>
        <TextInput
          placeholder='Email'
          placeholderTextColor={color.dark}
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: color.offWhite,
            width: '100%',
            height: 50,
            fontFamily: 'text',
            color: color.dark,
            fontSize: 16,
            borderRadius: 8,
            marginTop: 10,
            paddingHorizontal: 10
          }}
        />
        <TextInput
          placeholder='Phone'
          placeholderTextColor={color.dark}
          value={phone}
          onChangeText={setPhone}
          style={{
            backgroundColor: color.offWhite,
            width: '100%',
            height: 50,
            fontFamily: 'text',
            color: color.dark,
            fontSize: 16,
            borderRadius: 8,
            marginTop: 10,
            paddingHorizontal: 10
          }}
        />
        <TouchableOpacity
          onPress={makePayment}
          disabled={disable}
          style={{
            height: 50,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: color.dark
          }}
        >
          {
            loading ?
              <ActivityIndicator color={color.white} size='small' /> :
              <Text
                style={{
                  fontFamily: 'text',
                  color: color.white
                }}
              >
                Pay now
              </Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Payment