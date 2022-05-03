import React, { createContext, useContext, useEffect, useState } from 'react'
import * as Google from 'expo-google-app-auth'

const AuthContext = createContext({})

const config = {
  iosClientId: '226795182379-0vc5joofiinjq2lr26ut1qisj4ce3v0m.apps.googleusercontent.com',
  androidClientId: '226795182379-o54lbfbngssuc4lpnf0ifqbmshbmrbr3.apps.googleusercontent.com',
  webClientId: '226795182379-o54lbfbngssuc4lpnf0ifqbmshbmrbr3.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location']
}

export const AuthProvider = ({ children }) => {

  const signInWighGoogle = async () => {
    await Google.logInAsync(config)
      .then(async loginResult => {
        if (loginResult.type == 'success') {
          //login
        } else { }
      })
  }

  return (
    <AuthContext.Provider
      value={{
        user: false,
        signInWighGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// host.exp.exponent
export default function useAuth () {
  return useContext(AuthContext)
}