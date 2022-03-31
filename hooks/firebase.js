import firebase from "firebase"

import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB8rnTjskrh5Mt9fc0O_EznCxjaff4tauY",
    authDomain: "oymo-e96b4.firebaseapp.com",
    projectId: "oymo-e96b4",
    storageBucket: "oymo-e96b4.appspot.com",
    messagingSenderId: "634082050899",
    appId: "1:634082050899:web:2683530e121906abbd97a6",
    measurementId: "G-58KYT6CCN"
};

if (firebase.apps.length === 0)
    firebase.initializeApp(firebaseConfig)

export default firebase