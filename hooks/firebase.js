import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBbi-88lsmduBK2MBaf8iCGG1w0-KjwltQ",
  authDomain: "oymodates-38e12.firebaseapp.com",
  projectId: "oymodates-38e12",
  storageBucket: "oymodates-38e12.appspot.com",
  messagingSenderId: "226795182379",
  appId: "1:226795182379:web:2ae14674977a7ce6024d6e",
  measurementId: "G-ZHE14XQR3H"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()

export { auth, db }