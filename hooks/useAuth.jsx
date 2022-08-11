import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'

import * as Google from 'expo-auth-session/providers/google'
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
} from 'firebase/auth'

import { auth, db } from './firebase'

import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'

import { useNavigation } from '@react-navigation/native'

import { webClientId, appToken } from '@env'

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
  const [phone, setPhone] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [school, setSchool] = useState('')
  const [city, setCity] = useState('')
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
  const [reels, setReels] = useState([])
  const [reelsLimit, setReelsLimit] = useState(20)
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
  const [overlay, setOverlay] = useState(false)

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
    }
  }, [googleResponse])

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
    onSnapshot(query(collection(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid, 'pendingSwipes'),
      where('photoURL', '!=', null)
    ),
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
    onSnapshot(doc(db, 'users', user?.uid),
      doc => {
        let profile = doc?.data()
        setUserProfile(profile)
        resetUserProfile(profile)
      })

    registerIndieID(user?.uid == undefined ? user?.user?.uid : user?.uid, 3167, appToken)
  }

  const resetUserProfile = profile => {
    setJob('')
    setCompany('')
    setUsername('')
    setPhone('')
    setSchool('')
    setCity('')
    setScreen('default')
    setAbout('')
    setPassions([])

    if (profile?.job) setJob(profile?.job)
    if (profile?.company) setCompany(profile?.company)
    if (profile?.username) setUsername(profile?.username)
    if (profile?.phone) setPhone(profile?.phone)
    if (profile?.displayName) setDisplayName(profile?.displayName)
    if (profile?.school) setSchool(profile?.school)
    if (profile?.city) setCity(profile?.city)
    if (profile?.about) setAbout(profile?.about)
    if (profile?.passions) setPassions([...profile?.passions])
    if (profile?.theme) setTheme(profile?.theme)
    if (profile?.lookingFor) setLookingFor(profile?.lookingFor)
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

  const values = {
    user,
    loading,
    logout,
    error,
    userProfile,
    image,
    job,
    username,
    phone,
    setPhone,
    displayName,
    setDisplayName,
    school,
    company,
    setCompany,
    city,
    setCity,
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
    showExpand,
    setShowExpand,
    reel,
    setReel,
    thumbnail,
    setThumbnail,
    googleLoadng,
    setGoogleLoading,
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
    setLookingFor,
    overlay,
    setOverlay
  }

  const memoValue = useMemo(() => ({
    ...values
  }), [values])

  return (
    <AuthContext.Provider
      value={memoValue}
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
