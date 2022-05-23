import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import Constants from 'expo-constants'

const app = initializeApp(Constants.manifest.firebase)
const auth = getAuth()
const db = getFirestore()

export { auth, db }