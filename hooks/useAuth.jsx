import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import * as Google from 'expo-auth-session/providers/google'
import * as Facebook from 'expo-auth-session/providers/facebook'
import { ResponseType } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

import { registerIndieID } from 'native-notify'

WebBrowser.maybeCompleteAuthSession()

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  FacebookAuthProvider
} from 'firebase/auth'

import { auth, db } from './firebase'

import { collection, doc, limit, onSnapshot, query, where } from 'firebase/firestore'

import { useNavigation } from '@react-navigation/native'

import { webClientId, facebookClientId } from '@env'
import { ToastAndroid } from 'react-native'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const navigation = useNavigation()

  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [signinEmail, setSigninEmail] = useState('')
  const [signinPassword, setSigninPassword] = useState('')
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true)
  const [authType, setAuthType] = useState('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [job, setJob] = useState('')
  const [company, setCompany] = useState('')
  const [image, setImage] = useState(null)
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [school, setSchool] = useState('')
  const [city, setCity] = useState('')
  const [checked, setChecked] = useState('male')
  const [screen, setScreen] = useState('default')
  const [about, setAbout] = useState('')
  const [passions, setPassions] = useState([])
  const [media, setMedia] = useState('')
  const [pendingSwipes, setPendingSwipes] = useState([])
  const [profiles, setProfiles] = useState([])
  const [mediaVidiblity, setMediaVidiblity] = useState(false)
  const [reelsProps, setReelsProps] = useState(null)
  const [notifications, setNotificatios] = useState([])
  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: 0 })
  const [likeDisable, setLikeDisable] = useState(false)
  const [chatTheme, setChatTheme] = useState(false)
  const [reelsCommentType, setReelsCommentType] = useState('comment')
  const [postCommentType, setPostCommentType] = useState('comment')
  const [replyCommentProps, setReplyCommentProps] = useState(null)
  const [commentAutoFocus, setCommentAutoFocus] = useState(false)
  const [messageReply, setMessageReply] = useState(null)
  const [showExpand, setShowExpand] = useState(true)
  const [reel, setReel] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [mediaType, setMediaType] = useState()
  const [googleLoadng, setGoogleLoading] = useState(false)
  const [facebookLoadng, setFacebookLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [postLimit, setPostLimit] = useState(3)
  const [reels, setReels] = useState([])
  const [reelsLimit, setReelsLimit] = useState(2)
  const [viewUser, setViewUser] = useState(null)

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId
  })

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse?.params
      const credential = GoogleAuthProvider.credential(id_token)
      signInWithCredential(auth, credential)
    } else {
      setGoogleLoading(false)
      setFacebookLoading(false)
    }
  }, [googleResponse])

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: facebookClientId,
  })

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { access_token } = fbResponse?.params
      const credential = FacebookAuthProvider?.credential(access_token)
      signInWithCredential(auth, credential)
    } else {
      setGoogleLoading(false)
      setFacebookLoading(false)
    }
  }, [fbResponse]);

  const signup = () => {
    if (signinEmail != '' || signinPassword != '') {
      setAuthLoading(true)
      createUserWithEmailAndPassword(auth, signinEmail, signinPassword)
        .then(userCredential => {
          setUser(userCredential)
          setAuthLoading(false)
        }).catch(error => {
          ToastAndroid.showWithGravity(
            'Sign up Error. Seems like you already have an account',
            ToastAndroid.LONG,
            ToastAndroid.TOP
          )
        }).finally(() => setAuthLoading(false))
    }
  }

  const signin = () => {
    if (signinEmail != '' || signinPassword != '') {
      setAuthLoading(true)
      signInWithEmailAndPassword(auth, signinEmail, signinPassword)
        .then(userCredential => {
          setUser(userCredential)
          setAuthLoading(false)
        }).catch(error => {
          ToastAndroid.showWithGravity(
            'Signin Error. Seems like you don`t have an account',
            ToastAndroid.LONG,
            ToastAndroid.TOP
          )
        }).finally(() => setAuthLoading(false))
    }
  }

  const recoverPassword = () => { }

  useEffect(() =>
    (() => {
      onAuthStateChanged(auth, user => {
        if (user) {
          setUser(user)
          getUserProfile(user)
          getPendingSwipes(user)
        }
        else setUser(null)
        setLoadingInitial(false)
      })
    })()
    , [])

  useEffect(() => {
    (() => {
      onSnapshot(collection(db, 'reels'), limit(reelsLimit), doc => {
        setReels(
          doc?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
      })
    })()
  }, [])

  const getPendingSwipes = (user) => {
    onSnapshot(collection(db, 'users', user?.uid, 'pendingSwipes'),
      snapshot =>
        setPendingSwipes(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
    )
  }

  const getUserProfile = async user => {
    const unsub = onSnapshot(doc(db, 'users', user?.uid),
      doc => {
        let profile = doc?.data()
        setUserProfile(profile)

        setJob('')
        setCompany('')
        setUsername('')
        setSchool('')
        setCity('')
        setChecked('male')
        setScreen('default')
        setAbout('')
        setPassions([])

        if (profile?.job) setJob(profile?.job)
        if (profile?.company) setCompany(profile?.company)
        if (profile?.username) setUsername(profile?.username)
        if (profile?.school) setSchool(profile?.school)
        if (profile?.city) setCity(profile?.city)
        if (profile?.gender) setChecked(profile?.gender)
        if (profile?.screen) setScreen(profile?.screen)
        if (profile?.about) setAbout(profile?.about)
        if (profile?.passions) setPassions([...profile?.passions])
      })

    registerIndieID(user?.uid, 3167, 'ND7GyrPMrqE6c0PdboxvGF')

    setGoogleLoading(false)
    setFacebookLoading(false)
    return unsub
  }

  const logout = () => {
    setLoading(true)

    signOut(auth)
      .catch(error => setError(error))
      .finally(() => {
        setLoading(false)
        setUser(null)
        navigation.navigate('Login')
      })
  }

  let madiaString = JSON.stringify(media)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        error,
        userProfile,
        image,
        job,
        username,
        displayName,
        setDisplayName,
        school,
        media,
        setMedia,
        madiaString,
        company,
        setCompany,
        city,
        setCity,
        checked,
        setChecked,
        about,
        setAbout,
        passions,
        setPassions,
        pendingSwipes,
        setPendingSwipes,
        profiles,
        setProfiles,
        mediaVidiblity,
        setMediaVidiblity,
        reelsProps,
        setReelsProps,
        notifications,
        setNotificatios,
        currentLikesState,
        setCurrentLikesState,
        likeDisable,
        setLikeDisable,
        chatTheme,
        setChatTheme,
        reelsCommentType,
        setReelsCommentType,
        postCommentType,
        setPostCommentType,
        replyCommentProps,
        setReplyCommentProps,
        commentAutoFocus,
        setCommentAutoFocus,
        screen,
        setScreen,
        setUsername,
        setJob,
        setCompany,
        setSchool,
        setCity,
        setAbout,
        setImage,
        setError,
        setUser,
        setLoadingInitial,
        setLoading,
        messageReply,
        setMessageReply,
        signinEmail,
        setSigninEmail,
        signinPassword,
        setSigninPassword,
        securePasswordEntry,
        setSecurePasswordEntry,
        authType,
        setAuthType,
        authLoading,
        signup,
        signin,
        recoverPassword,
        googlePromptAsync,
        fbPromptAsync,
        showExpand,
        setShowExpand,
        reel,
        setReel,
        thumbnail,
        setThumbnail,
        mediaType,
        setMediaType,
        googleLoadng,
        setGoogleLoading,
        facebookLoadng,
        setFacebookLoading,
        posts,
        postLimit,
        setPostLimit,
        reels,
        setReels,
        reelsLimit,
        setReelsLimit,
        viewUser,
        setViewUser
      }}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

// host.exp.exponent
// com.rukkiecodes.oymo
export default function useAuth () {
  return useContext(AuthContext)
}
