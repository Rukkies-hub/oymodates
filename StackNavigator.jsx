import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

import Index from './Index'
import DrawerNavigator from './DrawerNavigator'
import Login from './screens/Login'
import EditProfile from './screens/EditProfile'
import NewMatch from './screens/modal/NewMatch'
import Message from './screens/Message'
import Add from './screens/Add'
import AddReels from './screens/AddReels'
import SaveReels from './screens/SaveReels'
import AddComment from './screens/modal/AddComment'
import PostCamera from './screens/PostCamera'
import ViewPost from './screens/ViewPost'
import UserProfile from './screens/modal/UserProfile'
import Passion from './screens/modal/Passion'
import UserLocation from './screens/modal/UserLocation'
import PreviewMessageImage from './screens/modal/PreviewMessageImage'
import Profile from './screens/profile/Profile'
import VideoCall from './screens/VideoCall'
import AccountSettings from './screens/AccountSettings'
import Notifications from './screens/Notifications'
import AllPostLikes from './screens/AllPostLikes'
import ViewReel from './screens/ViewReel'
import ViewAvarar from './screens/modal/ViewAvarar'
import ReelsComment from './screens/modal/ReelsComment'

import useAuth from './hooks/useAuth'

const StackNavigator = () => {
  const { user, appAuth } = useAuth()

  return (
    <Stack.Navigator>
      {
        user ? (
          <>
            <Stack.Group>
              {/* <Stack.Screen name='Index' component={Index} options={{ headerShown: false }} /> */}
              <Stack.Screen name='DrawerNavigator' component={DrawerNavigator} options={{ headerShown: false }} />
              <Stack.Screen name='Message' component={Message} options={{ headerShown: false }} />
              <Stack.Screen name='EditProfile' component={EditProfile} options={{ headerShown: false }} />
              <Stack.Screen name='Add' component={Add} options={{ headerShown: false }} />
              <Stack.Screen name='AddReels' component={AddReels} options={{ headerShown: false }} />
              <Stack.Screen name='SaveReels' component={SaveReels} options={{ headerShown: false }} />
              <Stack.Screen name='PostCamera' component={PostCamera} options={{ headerShown: false }} />
              <Stack.Screen name='ViewPost' component={ViewPost} options={{ headerShown: false }} />
              <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
              <Stack.Screen name='VideoCall' component={VideoCall} options={{ headerShown: false }} />
              <Stack.Screen name='AccountSettings' component={AccountSettings} options={{ headerShown: false }} />
              <Stack.Screen name='Notifications' component={Notifications} options={{ headerShown: false }} />
              <Stack.Screen name='AllPostLikes' component={AllPostLikes} options={{ headerShown: false }} />
              <Stack.Screen name='ViewReel' component={ViewReel} options={{ headerShown: false }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
              <Stack.Screen name='NewMatch' component={NewMatch} options={{ headerShown: false }} />
              <Stack.Screen name='ViewAvarar' component={ViewAvarar} options={{ headerShown: false }} />
              <Stack.Screen name='ReelsComment' component={ReelsComment} options={{ headerShown: false }} />
              <Stack.Screen name='AddComment' component={AddComment} options={{ headerShown: false }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name='UserProfile' component={UserProfile} options={{ headerShown: false }} />
              <Stack.Screen name='Passion' component={Passion} options={{ headerShown: false }} />
              <Stack.Screen name='UserLocation' component={UserLocation} options={{ headerShown: false }} />
              <Stack.Screen name='PreviewMessageImage' component={PreviewMessageImage} options={{ headerShown: false }} />
            </Stack.Group>
          </>
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator