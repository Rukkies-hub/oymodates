import React from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const Stack = createStackNavigator()

import BottomNavigation from './BottomNavigation'
import TopNavigation from './TopNavigation'
import Login from '../screens/Login'
import EditProfile from '../screens/EditProfile'
import NewMatch from '../screens/modal/NewMatch'
import Message from '../screens/Message'
import Add from '../screens/Add'
import AddReels from '../screens/AddReels'
import SaveReels from '../screens/SaveReels'
import PostCamera from '../screens/PostCamera'
import ViewPost from '../screens/ViewPost'
import UserProfile from '../screens/userProfile/UserProfile'
import Passion from '../screens/modal/Passion'
import UserLocation from '../screens/modal/UserLocation'
import PreviewMessageImage from '../screens/modal/PreviewMessageImage'
import Profile from '../screens/profile/Profile'
import VideoCall from '../screens/VideoCall'
import AccountSettings from '../screens/accountSettings/AccountSettings'
import Notifications from '../screens/Notifications'
import AllPostLikes from '../screens/AllPostLikes'
import ViewReel from '../screens/ViewReel'
import ViewAvarar from '../screens/modal/ViewAvarar'
import ReelsComment from '../screens/ReelsComment'
import ViewVideo from '../screens/modal/ViewVideo'
import MessageOptions from '../screens/modal/MessageOptions'
import MessageCamera from '../screens/modal/MessageCamera'
import ViewReelsComments from '../screens/modal/ViewReelsComments'

import useAuth from '../hooks/useAuth'

const StackNavigator = () => {
  const { user, userProfile } = useAuth()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        keyboardHandlingEnabled: true,
        animationEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      {
        user ? (
          <>
            <Stack.Group>
              {
                userProfile?.layout == 'top' ?
                  <Stack.Screen name='Main' component={TopNavigation} /> :
                  <Stack.Screen name='Main' component={BottomNavigation} />
              }
              <Stack.Screen name='Message' component={Message} />
              <Stack.Screen name='EditProfile' component={EditProfile} />
              <Stack.Screen name='Add' component={Add} />
              <Stack.Screen name='AddReels' component={AddReels} />
              <Stack.Screen name='SaveReels' component={SaveReels} />
              <Stack.Screen name='PostCamera' component={PostCamera} />
              <Stack.Screen name='ViewPost' component={ViewPost} />
              <Stack.Screen name='Profile' component={Profile} />
              <Stack.Screen name='VideoCall' component={VideoCall} />
              <Stack.Screen name='AccountSettings' component={AccountSettings} />
              <Stack.Screen name='Notifications' component={Notifications} />
              <Stack.Screen name='AllPostLikes' component={AllPostLikes} />
              <Stack.Screen name='MessageCamera' component={MessageCamera} />
            </Stack.Group>

            <Stack.Group
              screenOptions={{
                presentation: 'transparentModal'
              }}>
              <Stack.Screen name='NewMatch' component={NewMatch} />
              <Stack.Screen name='ViewAvarar' component={ViewAvarar} />
              <Stack.Screen name='ReelsComment' component={ReelsComment} />
              <Stack.Screen name='ViewVideo' component={ViewVideo} />
              <Stack.Screen name='MessageOptions' component={MessageOptions} />
            </Stack.Group>

            <Stack.Group
              screenOptions={{
                presentation: 'modal'
              }}>
              <Stack.Screen name='ViewReel' component={ViewReel} />
              <Stack.Screen name='UserProfile' component={UserProfile} />
              <Stack.Screen name='Passion' component={Passion} />
              <Stack.Screen name='UserLocation' component={UserLocation} />
              <Stack.Screen name='PreviewMessageImage' component={PreviewMessageImage} />
              <Stack.Screen name='ViewReelsComments' component={ViewReelsComments} />
            </Stack.Group>
          </>
        ) : (
          <Stack.Screen name='Login' component={Login} />
        )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator