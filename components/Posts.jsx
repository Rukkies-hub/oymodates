import React from 'react'
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity
} from 'react-native'

import useAuth from '../hooks/useAuth'

import { useFonts } from 'expo-font'
import color from '../style/color'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const Posts = () => {
  const { userProfile, user } = useAuth()

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded)
    return null

  return (
    <View
      style={{
        flex: 1,
        marginVertical: 10
      }}
    >
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Image
            source={{ uri: userProfile?.photoURL || user?.photoURL }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50
            }}
          />
          <Text
            style={{
              fontFamily: 'text',
              marginLeft: 10,
              fontSize: 14,
              color: color.dark
            }}
          >
            {userProfile?.displayName || user?.displayName}
          </Text>
        </Pressable>

        <TouchableOpacity
          style={{
            height: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <MaterialCommunityIcons name='dots-vertical' color={color.lightText} size={25} />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: userProfile?.photoURL || user?.photoURL }}
        style={{
          width: '100%',
          height: 400
        }}
      />

      <View
        style={{
          padding: 10,
          flexDirection: 'row'
        }}
      >
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20
          }}
        >
          <FontAwesome5 name='heart' size={25} color={color.lightText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20
          }}
        >
          <FontAwesome5 name='comments' size={25} color={color.lightText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20
          }}
        >
          <FontAwesome5 name='share' size={25} color={color.lightText} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}
      >
        <Image
          source={{ uri: userProfile?.photoURL || user?.photoURL }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 50
          }}
        />

        <View>
          <View
            style={{
              marginLeft: 10,
              backgroundColor: color.blue,
              borderTopRightRadius: 12,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              paddingVertical: 4,
              paddingHorizontal: 10
            }}
          >
            <Text
              style={{
                fontFamily: 'text',
                color: color.white,
                fontSize: 14
              }}
            >
              {userProfile?.displayName || user?.displayName}
            </Text>
            <Text
              style={{
                color: color.white
              }}
            >
              Some long comment
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row'
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 4,
                paddingHorizontal: 5,
                marginRight: 5
              }}
            >
              <Text>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 4,
                paddingHorizontal: 5
              }}
            >
              <Text>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingHorizontal: 10,
          marginTop: 10
        }}
      >
        <Image
          source={{ uri: userProfile?.photoURL || user?.photoURL }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 50,
            marginRight: 10
          }}
        />

        <View
          style={{
            backgroundColor: color.offWhite,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 12,
            height: 40,
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: color.lightText
            }}
          >
            Write a comment...
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Posts