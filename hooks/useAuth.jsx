import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect
} from 'react'

import * as Google from 'expo-google-app-auth'

// import * as Google from 'expo-auth-session/providers/google'
// import * as WebBrowser from 'expo-web-browser'

// WebBrowser.maybeCompleteAuthSession()

import axios from 'axios'

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { auth, db } from './firebase'

import { collection, doc, onSnapshot } from 'firebase/firestore'

import { useNavigation } from '@react-navigation/native'

import { iosClientId, androidClientId, webClientId } from '@env'
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
  const [date, setDate] = useState()
  const [job, setJob] = useState('')
  const [company, setCompany] = useState('')
  const [image, setImage] = useState(null)
  const [username, setUsername] = useState('')
  const [school, setSchool] = useState('')
  const [city, setCity] = useState('')
  const [checked, setChecked] = useState('male')
  const [screen, setScreen] = useState('default')
  const [about, setAbout] = useState('')
  const [passions, setPassions] = useState([])
  const [media, setMedia] = useState('')
  const [pendingSwipes, setPendingSwipes] = useState([])
  const [profiles, setProfiles] = useState([])
  const [address, setAddress] = useState(null)
  const [mediaVidiblity, setMediaVidiblity] = useState(false)
  const [reelsProps, setReelsProps] = useState(null)
  const [notifications, setNotificatios] = useState([])
  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: 0 })
  const [likeDisable, setLikeDisable] = useState(false)
  const [chatTheme, setChatTheme] = useState(false)
  const [reelsCommentType, setReelsCommentType] = useState('comment')
  const [replyCommentProps, setReplyCommentProps] = useState(null)
  const [commentAutoFocus, setCommentAutoFocus] = useState(false)
  const [messageReply, setMessageReply] = useState(null)

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: webClientId,
  //   androidClientId,
  //   iosClientId,
  //   webClientId
  // })

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response

  //     signInWighGoogle(authentication.accessToken)

  //     console.log(response)
  //   }
  // }, [response])

  // const signInWighGoogle = async accessToken => {
  //   try {
  //     let req = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo',
  //       { headers: { Authorization: `Bearer ${accessToken}` } })

  //     // const credential = GoogleAuthProvider.credential(req?.data?.id, accessToken)

  //     // await signInWithCredential(auth, credential)

  //     console.log(req.data)
  //   }
  //   catch (error) {
  //     console.log('GoogleUserReq error: ', error)
  //   }
  // }

  const signInWighGoogle = async () => {
    setLoading(true)
    await Google.logInAsync({
      iosClientId,
      androidClientId,
      scopes: ['profile', 'email'],
      permissions: ['public_profile', 'email']
    }).then(async loginResult => {
      if (loginResult.type === 'success') {
        const { idToken, accessToken } = loginResult
        const credential = GoogleAuthProvider.credential(idToken, accessToken)

        await signInWithCredential(auth, credential)
      }

      return Promise.reject()
    }).catch(error => {
      console.log(`${error.code} => ${error.message}`)
      setError(error)
    }).finally(() => setLoading(false))
  }

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

  const getPendingSwipes = (user) => {
    onSnapshot(collection(db, 'users', user?.uid, 'pendingSwipes'),
      snapshot =>
        setPendingSwipes(
          snapshot?.docs?.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
    )
  }

  const getUserProfile = async user => {
    const unsub = onSnapshot(doc(db, 'users', user?.uid),
      doc => {
        let profile = doc.data()
        setUserProfile(profile)

        if (profile?.ageDate) setDate(profile?.ageDate)
        if (profile?.job) setJob(profile?.job)
        if (profile?.company) setCompany(profile?.company)
        if (profile?.username) setUsername(profile?.username)
        if (profile?.school) setSchool(profile?.school)
        if (profile?.city) setCity(profile?.city)
        if (profile?.gender) setChecked(profile?.gender)
        if (profile?.screen) setScreen(profile?.screen)
        if (profile?.about) setAbout(profile?.about)
        if (profile?.passions) setPassions([...profile?.passions])
        if (profile?.address) setAddress(...profile?.address)
      })

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
        date,
        job,
        username,
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
        address,
        setAddress,
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
        replyCommentProps,
        setReplyCommentProps,
        commentAutoFocus,
        setCommentAutoFocus,
        screen,
        setScreen,
        setUsername,
        setDate,
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
        // promptAsync,
        signInWighGoogle
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
