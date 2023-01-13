// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2yD2QkE87dpJlujZ5lgFHx7-iF4_EHGs",
  authDomain: "whatsapp-741dd.firebaseapp.com",
  projectId: "whatsapp-741dd",
  storageBucket: "whatsapp-741dd.appspot.com",
  messagingSenderId: "640395658702",
  appId: "1:640395658702:web:4a206525e2c79562b6179f"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };