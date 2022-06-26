import React, { createContext, useContext, useState, useEffect } from 'react'
import { ToastAndroid } from 'react-native'

import { iosClientId, androidClientId } from '@env'

import * as Google from 'expo-google-app-auth'

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { auth, db } from './firebase'

const config = {
  iosClientId,
  androidClientId,
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location']
}

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(false)
  const [signinEmail, setSigninEmail] = useState('')
  const [signinPassword, setSigninPassword] = useState('')
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true)
  const [authType, setAuthType] = useState('login')

  useEffect(() =>
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user)
        // getUserProfile(user)
        // getPendingSwipes(user)
      } else setUser(null)
      // setLoadingInitial(false)
    }), [])

  const signInWighGoogle = async () => {
    setGoogleAuthLoading(true)

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
      .finally(() => setGoogleAuthLoading(false))
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
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
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
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }).finally(() => setAuthLoading(false))
    }
  }

  const recoverPassword = () => { }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        googleAuthLoading,
        error,
        initialLoading,
        signinEmail,
        setSigninEmail,
        signinPassword,
        setSigninPassword,
        securePasswordEntry,
        setSecurePasswordEntry,
        authType,
        setAuthType,
        signInWighGoogle,
        authLoading,
        setAuthLoading,
        signup,
        signin,
        recoverPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth () {
  return useContext(AuthContext)
}
// com.rukkiecodes.oymo