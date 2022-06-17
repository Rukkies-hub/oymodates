import React from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'

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

function CustomDrawerContent (props) {
  const userProfile = props?.userProfile
  const navigation = useNavigation()

  const [loaded] = useFonts({
    text: require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
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
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              fontSize: 16,
              fontFamily: 'boldText'
            }}
          >
            @{userProfile?.username}
          </Text>
          <Text
            style={{
              color: userProfile?.appMode == 'light' ? color.dark : color.white,
              fontSize: 14
            }}
          >
            {userProfile?.displayName}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}


const DrawerNavigator = () => {
  const { userProfile } = useAuth()
  const Drawer = createDrawerNavigator()

  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={props => <CustomDrawerContent userProfile={userProfile} {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: userProfile?.appMode == 'light' ? color.white : userProfile?.appMode == 'dark' ? color.dark : color.black,
          width: 250
        },
        drawerItemStyle: {
          backgroundColor: color.transparent
        },
        drawerLabelStyle: {
          color: color.white
        },
        drawerAllowFontScaling: true,
        drawerPosition: 'right',
        drawerType: 'slide',
        drawerStatusBarAnimation: 'slide'
      }}
    >

      <Drawer.Screen
        name="Feed"
        component={Index}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Feather name='home' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name="Match"
        component={Match}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name="Reels"
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
        name="Likes"
        component={Likes}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <SimpleLineIcons name='like' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Ionicons name='chatbubbles-outline' size={20} color={userProfile?.appMode == 'light' ? color.black : color.white} />
          )
        }}
      />

      <Drawer.Screen
        name="Notifications"
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