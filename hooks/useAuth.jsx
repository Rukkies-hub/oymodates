import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo
} from 'react'
import * as Google from 'expo-google-app-auth'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut
} from 'firebase/auth'
import { auth, db } from './firebase'
import { async } from '@firebase/util'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext({})

const config = {
  iosClientId: '226795182379-0vc5joofiinjq2lr26ut1qisj4ce3v0m.apps.googleusercontent.com',
  androidClientId: '226795182379-o54lbfbngssuc4lpnf0ifqbmshbmrbr3.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location']
}

export const AuthProvider = ({ children }) => {

  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() =>
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user)
      else setUser(null)

      setLoadingInitial(false)
    })
    , [])

  useEffect(async () => {
    let profile = await (await getDoc(doc(db, 'users', user.uid))).data()
    setUserProfile(profile)
  }, [user])

  console.log(userProfile)

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

  const logout = () => {
    setLoading(true)

    signOut(auth)
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  const memodValue = useMemo(() => ({
    user,
    error,
    loading,
    logout,
    signInWighGoogle,
    userProfile
  }), [user, loading, error])

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