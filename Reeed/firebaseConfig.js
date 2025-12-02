// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACzQ8o_8Wxma7wyRiQLzeX5joc7MhPsoE",
  authDomain: "reeed-0.firebaseapp.com",
  projectId: "reeed-0",
  storageBucket: "reeed-0.firebasestorage.app",
  messagingSenderId: "201799859784",
  appId: "1:201799859784:web:a4eb03aacdeea39188a27d",
}

// Initialize Firebase

export const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app)
