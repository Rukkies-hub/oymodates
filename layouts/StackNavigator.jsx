import React from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const Stack = createStackNavigator()

import BottomNavigation from './BottomNavigation'
import Login from '../screens/auth/Login'
import EditProfile from '../screens/editProfile/EditProfile'
import NewMatch from '../screens/modal/NewMatch'
import Message from '../screens/message/Message'
import AddReels from '../screens/AddReels'
import SaveReels from '../screens/SaveReels'
import UserProfile from '../screens/userProfile/UserProfile'
import Passion from '../screens/modal/Passion'
import PreviewMessageImage from '../screens/PreviewMessageImage'
import Profile from '../screens/profile/Profile'
import Notifications from '../screens/notification/Notifications'
import ViewReel from '../screens/viewReel/ViewReel'
import ViewAvatar from '../screens/modal/ViewAvatar'
import ReelsComment from '../screens/ReelsComment'
import ViewVideo from '../screens/modal/ViewVideo'
import MessageCamera from '../screens/MessageCamera'
import ViewReelsComments from '../screens/viewReelsComments/ViewReelsComments'
import SetupModal from '../screens/modal/SetupModal'
import MessageOptions from '../screens/messageOptions/MessageOptions'

import useAuth from '../hooks/useAuth'
import ReelsOption from '../screens/modal/ReelsOption'

import color from '../style/color'
import Gender from '../screens/editProfile/components/Gender'
import GoogleAuth from '../screens/auth/GoogleAuth'

const StackNavigator = () => {
  const { user, theme } = useAuth()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        keyboardHandlingEnabled: true,
        animationEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
        cardStyle: {
          backgroundColor: !user ? color.transparent : theme == 'dark' ? color.black : color.white
        }
      }}
    >
      {
        user ? (
          <>
            <Stack.Group>
              <Stack.Screen name='Main' component={BottomNavigation} />
              <Stack.Screen name='Message' component={Message} />
              <Stack.Screen name='EditProfile' component={EditProfile} />
              <Stack.Screen name='AddReels' component={AddReels} />
              <Stack.Screen name='SaveReels' component={SaveReels} />
              <Stack.Screen name='Profile' component={Profile} />
              <Stack.Screen name='Notifications' component={Notifications} />
              <Stack.Screen name='MessageCamera' component={MessageCamera} />
              <Stack.Screen name='ReelsComment' component={ReelsComment} />
              <Stack.Screen name='PreviewMessageImage' component={PreviewMessageImage} />
              <Stack.Screen name='ViewReelsComments' component={ViewReelsComments} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
              <Stack.Screen name='NewMatch' component={NewMatch} />
              <Stack.Screen name='ViewAvatar' component={ViewAvatar} />
              <Stack.Screen name='ViewVideo' component={ViewVideo} />
              <Stack.Screen
                name='ReelsOption'
                component={ReelsOption}
                options={{
                  animationEnabled: true,
                  ...TransitionPresets.ModalSlideFromBottomIOS,
                  cardStyle: {
                    backgroundColor: color.transparent
                  }
                }}
              />
              <Stack.Screen
                name='SetupModal'
                component={SetupModal}
                options={{
                  animationEnabled: true,
                  ...TransitionPresets.FadeFromBottomAndroid,
                  cardStyle: {
                    backgroundColor: color.transparent
                  }
                }}
              />
              <Stack.Screen
                name='Gender'
                component={Gender}
                options={{
                  animationEnabled: true,
                  ...TransitionPresets.FadeFromBottomAndroid,
                  cardStyle: {
                    backgroundColor: color.transparent
                  }
                }}
              />
              <Stack.Screen
                name='MessageOptions'
                component={MessageOptions}
                options={{
                  animationEnabled: true,
                  ...TransitionPresets.FadeFromBottomAndroid,
                  cardStyle: {
                    backgroundColor: color.transparent
                  }
                }}
              />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name='ViewReel' component={ViewReel} />
              <Stack.Screen name='UserProfile' component={UserProfile} />
              <Stack.Screen name='Passion' component={Passion} />
            </Stack.Group>
          </>
        ) : (
          <>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
              <Stack.Screen name='GoogleAuth' component={GoogleAuth} />
            </Stack.Group>
          </>
        )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator