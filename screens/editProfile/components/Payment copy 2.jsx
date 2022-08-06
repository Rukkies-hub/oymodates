import React, { useRef, useState } from 'react'
import { View, Text, Dimensions, Image, TouchableOpacity, Modal, BackHandler } from 'react-native'

import { WebView } from 'react-native-webview'

import { publicKey } from '@env'

import uuid from 'uuid-random'
import color from '../../../style/color'
import useAuth from '../../../hooks/useAuth'

const { width, height } = Dimensions.get('window')

const Payment = () => {
  const { user, userProfile, theme } = useAuth()

  BackHandler.addEventListener('hardwareBackPress', () => {
    setVisible(false)
  })

  const webViewRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const close = () => {
    setVisible(false)
  }

  const Rave = {
    html: `  
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=${width}">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
          <link rel="dns-prefetch" href="//fonts.gstatic.com">
          <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
          <title>SUBSCRIPTION</title>
        </head>
          <body  onload="payWithRave()" style="background-color: #fff; height:100vh; padding-top: 1em">
            <form style="background-color:#fff; height: ${height}px; width: ${width}px">
              <script src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>
            </form>
          
          <script>
            const API_publicKey = "${publicKey}"
            window.onload = payWithRave
            function payWithRave() {
              var x = getpaidSetup({
                PBFPubKey: API_publicKey,
                customer_email: "${user?.email}",
                amount: 5,
                customer_phone: "${userProfile?.phone}",
                currency: "USD",
                payment_options: "card, mobilemoneyghana, ussd",
                txref: "${uuid()}",
                meta: [{
                  metaname: "${userProfile?.displayName}",
                  metavalue: "${userProfile?.phone}"
                }],
                onclose: function() {
                  var resp = {event:'cancelled'}
                  postMessage(JSON.stringify(resp))
                },
                callback: function(response) {
                  var txref = response.tx.txRef 
                  if (
                    response.tx.chargeResponseCode == "00" ||
                    response.tx.chargeResponseCode == "0"
                  ) {
                      var resp = {event:'successful', transactionRef:txref}
                      postMessage(JSON.stringify(resp))
                  } else {
                    var resp = {event:'error'}
                    postMessage(JSON.stringify(resp))
                  }
                  
                  x.close()
                }
              })
            }
          </script>
        </body>
      </html>`
  }

  const messageRecived = data => {
    let webResponse = JSON.parse(data)
    console.log(webResponse)
    console.log(webViewRef?.current)
  }

  const onMessage = data => {
    let webResponse = JSON.parse(data)
    console.log('data', webResponse)
  }

  return (
    <View>
      <Modal
        visible={visible}
        animationType='slide'
        transparent={false}
      >
        <WebView
          source={Rave}
          ref={webViewRef}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          onMessage={e => messageRecived(e.nativeEvent.data)}
        />
      </Modal>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          flex: 1,
          backgroundColor: theme == 'dark' ? color.white : color.offWhite,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
          marginTop: 20
        }}
      >
        <Image
          source={require('../../../assets/icon.png')}
          style={{
            width: 30,
            height: 30,
            marginRight: 10
          }}
        />
        <Text
          style={{
            fontFamily: 'text'
          }}
        >
          Oymo Plus ($5)
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Payment