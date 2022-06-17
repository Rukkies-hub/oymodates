import React from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons, Entypo, Fontisto } from '@expo/vector-icons'

import Index from './Index'
import Notifications from './screens/Notifications'
import useAuth from './hooks/useAuth'
import color from './style/color'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import Match from './screens/Match'
import Reels from './screens/Reels'
import Likes from './components/Likes'
import Chat from './screens/Chat'

import { SimpleAccordion } from 'react-native-simple-accordion'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './hooks/firebase'


const DrawerNavigator = () => {
  const { userProfile, logout, user } = useAuth()
  const Drawer = createDrawerNavigator()

  const navigation = useNavigation()

  const lightMode = () => updateDoc(doc(db, 'users', user?.uid), { appMode: 'light' })

  const darkMode = () => updateDoc(doc(db, 'users', user?.uid), { appMode: 'dark' })

  const lightsOut = () => updateDoc(doc(db, 'users', user?.uid), { appMode: 'lightsOut' })

  const [loaded] = useFonts({
    text: require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={props => (
        <DrawerContentScrollView {...props}>
          <ImageBackground
            blurRadius={50}
            source={{ uri: userProfile?.photoURL }}
            style={{
              flex: 1,
              width: '100%',
              minHeight: 200,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -40
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{
                marginHorizontal: 10,
                marginTop: 10,
                marginBottom: 20,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={{ uri: userProfile?.photoURL }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                  marginBottom: 10
                }}
              />
              <Text
                style={{
                  color: color.white,
                  fontSize: 16,
                  fontFamily: 'boldText'
                }}
              >
                @{userProfile?.username}
              </Text>
              <Text
                style={{
                  color: color.white,
                  fontSize: 14
                }}
              >
                {userProfile?.displayName}
              </Text>
            </TouchableOpacity>
          </ImageBackground>

          <DrawerItemList {...props} />

          <SimpleAccordion
            arrowColor={userProfile?.appMode == 'light' ? color.dark : color.white}
            bannerStyle={{
              backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.black : color.dark,
              marginHorizontal: 10,
              height: 40,
              borderRadius: 4,
              marginBottom: 10,
              paddingVertical: 0,
              paddingHorizontal: 10
            }}
            titleStyle={{
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              fontFamily: 'text',
              fontSize: 12,
            }}
            viewContainerStyle={{
              marginHorizontal: 10,
              backgroundColor: color.transparent,
              paddingHorizontal: 0
            }}
            showContentInsideOfCard={false}
            viewInside={
              <View
                style={{
                  backgroundColor: color.transparent
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    onPress={lightMode}
                    style={{
                      flex: 1,
                      height: 40,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.black : color.dark,
                      borderRadius: 4,
                      marginRight: 2,
                      paddingHorizontal: 10
                    }}>
                    <Entypo name="light-down" size={24} color={userProfile?.appMode == 'light' ? color.dark : color.white} />
                    <Text
                      style={{
                        fontFamily: 'text',
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
                        marginLeft: 10
                      }}
                    >
                      Light
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={darkMode}
                    style={{
                      flex: 1,
                      height: 40,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.black : color.dark,
                      borderRadius: 4,
                      marginRight: 2,
                      paddingHorizontal: 10
                    }}
                  >
                    <MaterialCommunityIcons name="theme-light-dark" size={22} color={userProfile?.appMode == 'light' ? color.dark : color.white} />
                    <Text
                      style={{
                        fontFamily: 'text',
                        color: userProfile?.appMode == 'light' ? color.dark : color.white,
                        marginLeft: 10
                      }}
                    >
                      Dark
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={lightsOut}
                  style={{
                    flex: 1,
                    height: 40,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: userProfile?.appMode == 'light' ? color.offWhite : userProfile?.appMode == 'dark' ? color.black : color.dark,
                    borderRadius: 4,
                    marginRight: 2,
                    paddingHorizontal: 10,
                    marginTop: 5
                  }}
                >
                  <Fontisto name="night-alt-cloudy" size={20} color={userProfile?.appMode == 'light' ? color.dark : color.white} />
                  <Text
                    style={{
                      fontFamily: 'text',
                      color: userProfile?.appMode == 'light' ? color.dark : color.white,
                      marginLeft: 10
                    }}
                  >
                    Lights out
                  </Text>
                </TouchableOpacity>
              </View>
            }
            title={'Appearance'}
          />

          <TouchableOpacity
            onPress={logout}
            style={{
              backgroundColor: color.red,
              marginHorizontal: 10,
              height: 40,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderRadius: 4,
              paddingHorizontal: 10
            }}
          >
            <SimpleLineIcons name='logout' size={18} color={color.white} />

            <Text
              style={{
                color: color.white,
                fontFamily: 'text',
                marginLeft: 10
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
          width: 250
        },
        drawerItemStyle: {
          backgroundColor: color.transparent
        },
        drawerLabelStyle: {
          color: userProfile?.appMode == 'light' ? color.black : color.white,
          fontFamily: 'text'
        },
        drawerAllowFontScaling: true,
        drawerPosition: 'right',
        drawerType: 'slide',
        drawerStatusBarAnimation: 'slide'
      }}
    >

      <Drawer.Screen
        name='Feed'
        component={Index}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Feather name='home' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name='Match'
        component={Match}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name='Reels'
        component={Reels}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Image
              source={userProfile?.appMode == 'light' ? require('./assets/video.png') : require('./assets/videoLight.png')}
              style={{
                width: 20,
                height: 20
              }}
            />
          )
        }}
      />

      <Drawer.Screen
        name='Likes'
        component={Likes}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <SimpleLineIcons name='like' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name='Chat'
        component={Chat}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Ionicons name='chatbubbles-outline' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name='Notifications'
        component={Notifications}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <SimpleLineIcons name='bell' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator