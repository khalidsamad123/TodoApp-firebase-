import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
// firestore

const firebaseConfig = {
  apiKey: "AIzaSyDtGxLEWcPHk8Q3BjMLREImNZ-sr-DiNn8",
  authDomain: "signup-login-57478.firebaseapp.com",
  projectId: "signup-login-57478",
  storageBucket: "signup-login-57478.appspot.com",
  messagingSenderId: "1028488640714",
  appId: "1:1028488640714:web:94adc06c37d85ccdae1c33",
  measurementId: "G-NLEK9Y6HHJ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);