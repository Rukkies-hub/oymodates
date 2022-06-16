import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo
} from 'react'

import {
  LayoutAnimation,
  UIManager,
} from 'react-native'

import * as Google from 'expo-google-app-auth'

import Constants from 'expo-constants'

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth, db } from './firebase'

import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'

import { useNavigation } from '@react-navigation/native'

import { iosClientId, androidClientId } from '@env'

const AuthContext = createContext({})

const config = {
  iosClientId,
  androidClientId,
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location']
}

export const AuthProvider = ({ children }) => {
  const navigation = useNavigation()

  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)
  const [authloading, setAuthLoading] = useState(false)
  const [signinEmail, setSigninEmail] = useState('')
  const [signinPassword, setSigninPassword] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const [date, setDate] = useState()
  const [job, setJob] = useState('')
  const [company, setCompany] = useState('')
  const [image, setImage] = useState(null)
  const [username, setUsername] = useState('')
  const [school, setSchool] = useState('')
  const [city, setCity] = useState('')
  const [checked, setChecked] = useState('male')
  const [about, setAbout] = useState('')
  const [passions, setPassions] = useState([])
  const [media, setMedia] = useState('')
  const [pendingSwipes, setPendingSwipes] = useState([])
  const [profiles, setProfiles] = useState([])
  const [assetsList, setAssetsList] = useState([])
  const [address, setAddress] = useState(null)
  const [mediaVidiblity, setMediaVidiblity] = useState(false)
  const [reelsProps, setReelsProps] = useState(null)
  const [notifications, setNotificatios] = useState([])
  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: 0 })
  const [likeDisable, setLikeDisable] = useState(false)
  const [chatTheme, setChatTheme] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [reelsCommentType, setReelsCommentType] = useState('comment')
  const [replyCommentProps, setReplyCommentProps] = useState(null)
  const [commentAutoFocus, setCommentAutoFocus] = useState(false)

  const signInWighGoogle = async () => {
    setLoading(true)

    await Google.logInAsync(config)
      .then(async loginResult => {
        if (loginResult.type === 'success') {
          //login
          const { idToken, accessToken } = loginResult
          const credential = GoogleAuthProvider.credential(idToken, accessToken)

          await signInWithCredential(auth, credential)
        }

        return Promise.reject()
      }).catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  const paswordSignin = async () => {
    signInWithEmailAndPassword(auth, signinEmail, signinPassword)
  }

  useEffect(() =>
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user)
        getUserProfile(user)
        getPendingSwipes(user)
      }
      else setUser(null)


      setLoadingInitial(false)
    })
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

  const showReplyInput = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    setMediaVidiblity(!mediaVidiblity)
  }

  let madiaString = JSON.stringify(media)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
        assetsList,
        setAssetsList,
        address,
        setAddress,
        mediaVidiblity,
        setMediaVidiblity,
        showReplyInput,
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
        secureTextEntry,
        setSecureTextEntry,
        authloading,
        setAuthLoading,
        signinEmail,
        setSigninEmail,
        signinPassword,
        setSigninPassword,
        paswordSignin,
        reelsCommentType,
        setReelsCommentType,
        replyCommentProps,
        setReplyCommentProps,
        commentAutoFocus,
        setCommentAutoFocus
      }}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

// host.exp.exponent
export default function useAuth () {
  return useContext(AuthContext)
}
