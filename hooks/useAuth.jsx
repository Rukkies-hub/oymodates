import React, { createContext, useContext, useEffect, useState } from 'react'
import { View, Text, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'

import firebase from "./firebase"

const AuthContext = createContext({})
import moment from 'moment'

export const AuthProvider = ({ children }) => {
  const navigation = useNavigation()

  const [user, setUser] = React.useState(null)
  const [renderHome, setRenderHome] = useState(false)

  // SIGN UP USER
  const [username, setUsername] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [spiner, setSpiner] = useState(false)

  // SIGN IN USER
  const [signinEmail, setSigninEmail] = useState("")
  const [signinPassword, setSigninPassword] = useState("")

  const [loadingInitial, setLoadingInitial] = React.useState(true)

  // USER PROFILE
  const [userProfile, setUserProfile] = useState({})

  // EDIT USERNAME
  const [editUsername, setEditUsername] = useState("")

  // EDIT Name
  const [name, setName] = useState("")

  // EDIT PASSWORD CHANGE
  const [accountEmail, setAccountEmail] = useState("")

  // EDIT GENDER
  const [date, setDate] = useState("")

  // EDIT JOB
  const [job, setJob] = useState("")

  // EDIT COMPANY
  const [company, setCompany] = useState("")

  // EDIT ABOUT ME
  const [about, setAbout] = useState("")

  // EDIT SCHOOL
  const [school, setSchool] = useState("")

  // EDIT ADDRESS
  const [address, setAddress] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadeding, setupLoadeding] = useState(false)

  const [isShowAgeEnabled, setIsShowAgeEnabled] = useState(false)
  const [isShowLocationEnabled, setIsShowLocationEnabled] = useState(false)

  const [isGlobal, setIsGlobal] = useState(false)

  const [distance, setDistance] = useState(30)

  const [onlyRange, setOnlyRange] = useState(false)

  const signupState = {
    username,
    setUsername,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    spiner
  }

  const signinState = {
    signinEmail,
    setSigninEmail,
    signinPassword,
    setSigninPassword,
    spiner
  }

  const usernameState = {
    username: editUsername,
    onchangeUsername: setEditUsername
  }

  const nameState = {
    name,
    setName
  }

  const updatePasswordState = {
    accountEmail,
    setAccountEmail
  }

  const updateDateState = {
    date,
    setDate
  }

  const updateJobState = {
    job,
    setJob
  }

  const updateCompanyState = {
    company,
    setCompany
  }

  const updateAboutState = {
    about,
    setAbout
  }

  const updateSchoolState = {
    school,
    setSchool
  }

  const updateAddressState = {
    address,
    setAddress
  }

  useEffect(() =>
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user)
        getUserProfile(user)
      }
      else setUser(null)
      setLoadingInitial(false)
    })
    , [])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })

    if (!result.cancelled) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
          resolve(xhr.response)
        }

        xhr.responseType = "blob"
        xhr.open("GET", result.uri, true)
        xhr.send(null)
      })

      const ref = firebase.storage().ref().child(`avatars/${new Date().toISOString()}`)
      const snapshot = ref.put(blob)

      snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
        setupLoadeding(true)
      }, (error) => {
        setupLoadeding(false)
        blob.close()
        return
      }, () => {
        snapshot.snapshot.ref.getDownloadURL().then(url => {
          setupLoadeding(false)

          firebase.firestore()
            .collection("users")
            .doc(`${user.uid}`)
            .update({
              avatar: firebase.firestore.FieldValue.arrayUnion(url)
            }).then(() => {
              getUserProfile(user)
            })

          blob.close()
          return url
        })
      })
    }
  }

  const getUserProfile = async (user) => {
    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        setUserProfile(doc?.data())
        if (doc.data()?.username)
          setEditUsername(doc.data()?.username)
        if (doc.data()?.name)
          setName(doc.data()?.name)
        if (doc.data()?.company)
          setCompany(doc.data()?.company)
        if (doc.data()?.school)
          setSchool(doc.data()?.school)
        if (doc.data()?.address)
          setAddress(doc.data()?.address)
        if (doc.data()?.hideAge)
          setIsShowAgeEnabled(doc.data()?.hideAge)
        if (doc.data()?.hideLocation)
          setIsShowLocationEnabled(doc.data()?.hideLocation)
        if (doc.data()?.global)
          setIsGlobal(doc.data()?.global)
        if (doc.data()?.maximumDistance)
          setDistance(doc.data()?.maximumDistance)
        if (doc.data()?.range)
          setOnlyRange(doc.data()?.range)
      })
  }

  const signupUser = async () => {
    const { signupEmail, signupPassword, username } = signupState
    let email = signupEmail
    let password = signupPassword

    if (signupEmail && signupPassword && username) {
      setSpiner(true)
      setLoading(true)
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
          firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
              email,
              username,
              avatar: [],
              id: firebase.auth().currentUser.uid
            })
          setSpiner(false)
          setLoading(false)
        })
        .catch(error => {
          setSpiner(false)
          setLoading(false)
        }).finally(() => {
          setSpiner(false)
          setLoading(false)
        })

    } else {
      Alert.alert("Error!", "Please complete the form then try again")
    }
  }

  const signinUser = async () => {
    const { signinEmail, signinPassword } = signinState

    let email = signinEmail
    let password = signinPassword

    if (signinEmail && signinPassword) {
      setSpiner(true)
      setLoading(true)
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
          if (result.user) {
            setSpiner(false)
            setLoading(false)
          }
        })
        .catch(error => {
          setSpiner(false)
          setLoading(false)
        }).finally(() => {
          setSpiner(false)
          setLoading(false)
        })
    } else {
      Alert.alert("Error!", "Please complete the form then try again")
    }
  }

  const logout = async () => {
    setLoading(true)
    await firebase.auth().signOut()
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  const updateAbout = async () => {
    const { about } = updateAboutState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        about
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  const updateUsername = async () => {
    const { username } = usernameState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        username
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  const updateName = async () => {
    const { name } = nameState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        name
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  const sendPasswordReset = async () => {
    const { accountEmail } = updatePasswordState

    if (accountEmail == user.email) {
      try {
        await firebase.auth().sendPasswordResetEmail(accountEmail)
        Alert.alert("Email sent", "Your password reset link has been set to your email")

        setTimeout(() => {
          logout()
        }, 3000)
      } catch (err) {
        console.error(err)
        alert(err.message)
      }
    } else Alert.alert("Email mismatched", "Entered email does not match you account email")
  }

  const updateDateOfBirth = async () => {
    const { date } = updateDateState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        age: moment().diff(moment(date, "DD-MM-YYYY"), 'years'),
        date
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  const updateJob = async () => {
    const { job } = updateJobState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        job
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  const updateCompany = async () => {
    const { company } = updateCompanyState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        company
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  const updateSchool = async () => {
    const { school } = updateSchoolState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        school
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  const updateAddress = async () => {
    const { address } = updateAddressState

    await firebase.firestore()
      .collection("users")
      .doc(`${user.uid}`)
      .update({
        address
      }).then(() => {
        getUserProfile(user)
        navigation.goBack()
      })
  }

  return (
    <AuthContext.Provider value={{
      user,
      loadingInitial,
      signupState,
      signinState,
      signupUser,
      signinUser,
      userProfile,
      pickImage,
      logout,
      usernameState,
      updateUsername,
      nameState,
      updateName,
      updatePasswordState,
      sendPasswordReset,
      updateDateState,
      updateDateOfBirth,
      updateJobState,
      updateJob,
      getUserProfile,
      renderHome,
      setRenderHome,
      updateAboutState,
      updateAbout,
      updateCompanyState,
      updateCompany,
      updateSchoolState,
      updateSchool,
      updateAddressState,
      updateAddress,
      isShowAgeEnabled,
      setIsShowAgeEnabled,
      isShowLocationEnabled,
      setIsShowLocationEnabled,
      isGlobal,
      setIsGlobal,
      distance,
      setDistance,
      onlyRange,
      setOnlyRange
    }}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

export default function useAuth () {
  return useContext(AuthContext)
}