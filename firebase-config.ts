// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-LgyybpDjbAOxRoPsUmVPPw5vU0ZSc6Q",
  authDomain: "budget-analyser-5c488.firebaseapp.com",
  projectId: "budget-analyser-5c488",
  storageBucket: "budget-analyser-5c488.firebasestorage.app",
  messagingSenderId: "565481755635",
  appId: "1:565481755635:web:5e304422fb2b45ad633886",
  measurementId: "G-LJ21GSG5ZN"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
export const auth = getAuth(app)