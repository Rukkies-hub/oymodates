import React from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native'
import color from '../../style/color'
import Bar from '../../components/StatusBar'
import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import MyReels from './MyReels'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons } from '@expo/vector-icons'

const Profile = () => {
  const navigation = useNavigation()
  const { userProfile } = useAuth()

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: userProfile?.theme == 'dark' ? color.black : color.white
      }}
    >
      <Bar color={userProfile?.theme == 'light' ? 'dark' : 'light'} />
      <Header showBack showTitle title='Profile' showAratar />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 20
        }}
      >
        {
          userProfile?.photoURL || user?.photoURL ?
            <Image
              source={{ uri: userProfile?.photoURL ? userProfile?.photoURL : user?.photoURL }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 100
              }}
            /> :
            <View
              style={{
                width: '100%',
                height: 400,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: userProfile?.theme == 'dark' ? color.black : color.offWhite,
                borderRadius: 20
              }}
            >
              <SimpleLineIcons name="user" size={60} color={userProfile?.theme == 'dark' ? color.white : color.lightText} />
            </View>
        }

        <View
          style={{
            flex: 1,
            paddingLeft: 20,
            justifyContent: 'center'
          }}
        >
          {
            userProfile?.username &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: userProfile?.theme == 'dark' ? color.white : color.dark,
                  fontFamily: 'boldText',
                  fontSize: 20
                }}
              >
                @{userProfile?.username}
              </Text>
            </View>
          }
          <Text
            style={{
              fontFamily: 'text',
              color: userProfile?.theme == 'dark' ? color.white : color.lightText
            }}
          >
            {userProfile?.displayName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            height: 40,
            width: 40,
          }}
        >
          <FontAwesome name="edit" size={20} color={userProfile?.theme == 'dark' ? color.white : color.dark} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginHorizontal: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginRight: 20
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: userProfile?.theme == 'dark' ? color.white : color.black
            }}
          >
            {userProfile?.followersCount ? userProfile?.followersCount : '0'}
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.lightText,
              marginLeft: 5
            }}
          >
            Followers
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 18,
              color: userProfile?.theme == 'dark' ? color.white : color.black
            }}
          >
            {userProfile?.likesCount ? userProfile?.likesCount : '0'}
          </Text>
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.lightText,
              marginLeft: 5
            }}
          >
            {userProfile?.likesCount == 1 ? 'Like' : 'Likes'}
          </Text>
        </View>
      </View>

      {
        userProfile?.about &&
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 20
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.dark
            }}
          >
            {userProfile?.about}
          </Text>
        </View>
      }

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Feather name='home' size={14} color={userProfile?.theme == 'dark' ? color.white : color.dark} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              marginLeft: 5
            }}
          >
            Lives in
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              marginLeft: 5
            }}
          >
            {userProfile?.city}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Fontisto name="date" size={14} color={userProfile?.theme == 'dark' ? color.white : color.dark} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: 10
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              marginLeft: 5
            }}
          >
            Joined
          </Text>
          <Text
            style={{
              fontFamily: 'boldText',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              marginLeft: 5
            }}
          >
            {userProfile?.timestamp?.toDate().toDateString()}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Feather name="briefcase" size={14} color={userProfile?.theme == 'dark' ? color.white : color.dark} />

        <Text
          style={{
            fontFamily: 'text',
            fontSize: 16,
            color: userProfile?.theme == 'dark' ? color.white : color.dark,
            marginLeft: 10
          }}
        >
          {userProfile?.job} at {userProfile?.company}
        </Text>
      </View>

      <MyReels />
    </SafeAreaView>
  )
}

export default Profile