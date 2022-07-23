import React from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'

import Bar from '../../components/StatusBar'
import Header from '../../components/Header'

const ProfileDetails = ({ userProfile, user }) => {
  const navigation = useNavigation()

  return (
    <ImageBackground
      source={{ uri: userProfile?.photoURL ? userProfile?.photoURL : 'https://firebasestorage.googleapis.com/v0/b/oymo-16379.appspot.com/o/post%20image%2F1.jpg?alt=media&token=58bfeb2e-2316-4c9c-b8ba-513275ae85d1' }}
      blurRadius={50}
    >
      <LinearGradient
        colors={[color.transparent, userProfile?.theme == 'dark' ? color.black : color.white]}
        style={{
          paddingHorizontal: 10
        }}
      >
        <Bar color={userProfile?.theme == 'dark' ? 'light' : 'dark'} />

        <Header
          showBack
          showTitle
          title={userProfile?.username}
          backgroundColor={color.transparent}
          showAratar
          showNotification
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
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
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: userProfile?.theme == 'dark' ? color.black : color.offWhite
                }}
              >
                <SimpleLineIcons name='user' size={60} color={userProfile?.theme == 'dark' ? color.white : color.lightText} />
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
            <FontAwesome name='edit' size={20} color={userProfile?.theme == 'dark' ? color.white : color.dark} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
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
          userProfile?.about != '' &&
          <View
            style={{
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

        {
          userProfile?.passions?.length > 1 &&
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 10
            }}
          >
            {
              userProfile?.passions?.map((passion, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      backgroundColor: userProfile?.theme == 'dark' ? color.faintBlack : color.faintWhite,
                      borderRadius: 100,
                      marginBottom: 10,
                      marginRight: 5
                    }}
                  >
                    <Text
                      style={{
                        color: userProfile?.theme == 'dark' ? color.white : color.lightText,
                        fontSize: 12,
                        fontFamily: 'text',
                        textTransform: 'capitalize'
                      }}
                    >
                      {passion}
                    </Text>
                  </View>
                )
              })
            }
          </View>
        }

        <View
          style={{
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
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Fontisto name='date' size={14} color={userProfile?.theme == 'dark' ? color.white : color.dark} />

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
            marginTop: 10,
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Feather name='briefcase' size={14} color={userProfile?.theme == 'dark' ? color.white : color.dark} />

          <Text
            style={{
              fontFamily: 'text',
              fontSize: 16,
              color: userProfile?.theme == 'dark' ? color.white : color.dark,
              marginLeft: 10
            }}
          >
            {userProfile?.job} {userProfile?.company != '' && 'at'} {userProfile?.company}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default ProfileDetails