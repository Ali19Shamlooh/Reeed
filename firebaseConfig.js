import { initializeApp } from "firebase/app";
// 1. Import the specific services you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACzQ8o_8Wxma7wyRiQLzeX5joc7MhPsoE",
  authDomain: "reeed-0.firebaseapp.com",
  projectId: "reeed-0",
  storageBucket: "reeed-0.firebasestorage.app",
  messagingSenderId: "201799859784",
  appId: "1:201799859784:web:a4eb03aacdeea39188a27d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialize and Export Auth and Firestore so other files can access them
export const auth = getAuth(app);
export const db = getFirestore(app);
