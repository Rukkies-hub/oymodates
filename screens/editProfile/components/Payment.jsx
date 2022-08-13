import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native'

import { Paystack } from 'react-native-paystack-webview'

import { paystackPublic, testpPaystackPublic } from '@env'
import color from '../../../style/color'
import useAuth from '../../../hooks/useAuth'

import uuid from 'uuid-random'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const Payment = () => {
  const { user, userProfile } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    if (transaction) goPro()
  }, [transaction])


  const goPro = async () => {
    if (transaction?.message === 'Approved') {
      setLoading(true)
      let date = new Date()
      date.setMonth(date.getMonth() + 2)
      let newDate = new Date(date)
      await updateDoc(doc(db, 'users', userProfile?.id), {
        paid: true,
        transaction: transaction?.transaction,
        trxref: transaction?.trxref,
        expires: newDate
      })
      setLoading(false)
    }
  }

  return (
    <View>
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <Paystack
          paystackKey={testpPaystackPublic}
          amount={'2500.00'}
          billingEmail={user?.email}
          activityIndicatorColor="green"
          channels={['card', 'bank', 'ussd']}
          refNumber={`Oymo-${uuid()}`}
          billingName={userProfile?.displayName || userProfile?.username}
          onCancel={(e) => {
            setModalVisible(false)
          }}
          onSuccess={(res) => {
            setTransaction(res?.data?.transactionRef)
            setModalVisible(false)
          }}
          autoStart={true}
        />
      </Modal>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          marginTop: 20,
          backgroundColor: color.transparent,
          borderWidth: 2,
          borderColor: color.goldDark,
          height: 50,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        {
          !loading ?
            <>
              <Image
                source={require('../../../assets/vip.png')}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 10
                }}
              />
              <Text
                style={{
                  color: color.goldDark,
                  fontFamily: 'text'
                }}
              >
                Go Premium
              </Text>
            </> :
            <ActivityIndicator color={color.goldDark} size='small' />
        }
      </TouchableOpacity>
    </View>
  )
}

export default Payment