import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo
} from 'react'

import * as Google from 'expo-google-app-auth'

import Constants from 'expo-constants'

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut
} from 'firebase/auth'
import { auth, db } from './firebase'

import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { Alert } from 'react-native'

const AuthContext = createContext({})

const config = {
  iosClientId: Constants.manifest.iosClientId,
  androidClientId: Constants.manifest.androidClientId,
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location']
}

export const AuthProvider = ({ children }) => {

  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
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
  const [about, setAbout] = useState('')
  const [passions, setPassions] = useState([])
  const [media, setMedia] = useState('')
  const [pendingSwipes, setPendingSwipes] = useState([])
  const [profiles, setProfiles] = useState([])
  const [assetsList, setAssetsList] = useState([])
  const [address, setAddress] = useState(null)
  const [appAuth, setAppAuth] = useState(null)

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

  useEffect(() =>
    onAuthStateChanged(auth, user => {
      setAppAuth(null)
      if (user) {
        setAppAuth(true)
        setUser(user)
        getUserProfile(user)
        getPendingSwipes(user)
      }
      else {
        setAppAuth(true)
        setUser(null)
      }

      setLoadingInitial(false)
    })
    , [])

  const getPendingSwipes = (user) => {
    onSnapshot(collection(db, 'users', user.uid, 'pendingSwipes'),
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
    let profile = await (await getDoc(doc(db, 'users', user.uid))).data()
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
  }

  const logout = () => {
    setLoading(true)

    signOut(auth)
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  let madiaString = JSON.stringify(media)

  const memodValue = useMemo(() => ({
    user,
    error,
    loading,
    logout,
    signInWighGoogle,
    userProfile,
    getUserProfile,
    date,
    setDate,
    job,
    setJob,
    image,
    setImage,
    username,
    setUsername,
    school,
    setSchool,
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
    setAddress
  }), [
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
    setAddress
  ])

  return (
    <AuthContext.Provider
      value={memodValue}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

// host.exp.exponent
export default function useAuth () {
  return useContext(AuthContext)
}
