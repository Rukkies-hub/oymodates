import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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

import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'

import { useNavigation } from '@react-navigation/native'

import { webClientId, facebookClientId, appToken } from '@env'
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
  const [googleLoadng, setGoogleLoading] = useState(false)
  const [facebookLoadng, setFacebookLoading] = useState(false)
  const [reels, setReels] = useState([])
  const [reelsLimit, setReelsLimit] = useState(10)
  const [viewUser, setViewUser] = useState(null)
  const [search, setSearch] = useState('')
  const [matches, setMatches] = useState([])
  const [matchesFilter, setMatchesFilter] = useState([])
  const [reply, setReply] = useState('')
  const [height, setHeight] = useState(40)
  const [showError, setShowError] = useState(false)
  const [signInSnack, setSignInSnack] = useState(false)
  const [signInSnackMessage, setSignInSnackMessage] = useState('')
  const [theme, setTheme] = useState('light')
  const [lookingFor, setLookingFor] = useState()

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
  }, [fbResponse])

  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const signup = () => {
    if (signinEmail.match(regexEmail) && signinPassword != '') {
      setAuthLoading(true)
      createUserWithEmailAndPassword(auth, signinEmail, signinPassword)
        .then(userCredential => {
          setUser(userCredential)
          setAuthLoading(false)
        }).catch(error => {
          setSignInSnack(true)
          setSignInSnackMessage('Email already in use')
        }).finally(() => setAuthLoading(false))
    }
  }

  const signin = () => {
    if (signinEmail.match(regexEmail) && signinPassword != '') {
      setAuthLoading(true)
      signInWithEmailAndPassword(auth, signinEmail, signinPassword)
        .then(userCredential => {
          setUser(userCredential)
          setAuthLoading(false)
        }).catch(error => {
          setSignInSnack(true)
          setSignInSnackMessage('Signin Error. Seems like you don`t have an account')
        }).finally(() => setAuthLoading(false))
    }
  }

  const recoverPassword = () => { }

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user)
        getUserProfile(user)
        getPendingSwipes(user)
      }
      else setUser(null)
      setLoadingInitial(false)
    })
  }, [])

  const getReels = async () => {
    const queryReels = await getDocs(query(collection(db, 'reels'), limit(reelsLimit), orderBy('timestamp', 'desc')))

    setReels(
      queryReels?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }))
    )
  }

  useLayoutEffect(() => {
    getReels()
  }, [])

  const getPendingSwipes = (user) => {
    onSnapshot(collection(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid, 'pendingSwipes'),
      snapshot =>
        setPendingSwipes(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
    )
  }

  const getUserProfile = user => {
    // const unsub =
    onSnapshot(doc(db, 'users', user?.uid),
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
        if (profile?.about) setAbout(profile?.about)
        if (profile?.passions) setPassions([...profile?.passions])
        if (profile?.theme) setTheme(profile?.theme)
        if (profile?.lookingFor) setLookingFor(profile?.lookingFor)
      })

    registerIndieID(user?.uid == undefined ? user?.user?.uid : user?.uid, 3167, appToken)

    // setGoogleLoading(false)
    // setFacebookLoading(false)
    // return unsub
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
        googleLoadng,
        setGoogleLoading,
        facebookLoadng,
        setFacebookLoading,
        reels,
        setReels,
        reelsLimit,
        setReelsLimit,
        viewUser,
        setViewUser,
        search,
        setSearch,
        matches,
        setMatches,
        matchesFilter,
        setMatchesFilter,
        reply,
        setReply,
        height,
        setHeight,
        showError,
        setShowError,
        signInSnack,
        setSignInSnack,
        signInSnackMessage,
        getReels,
        theme,
        setTheme,
        lookingFor,
        setLookingFor
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
