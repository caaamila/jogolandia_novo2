// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "jogolandia-7a862.firebaseapp.com",
  projectId: "jogolandia-7a862",
  storageBucket: "jogolandia-7a862.firebasestorage.app",
  messagingSenderId: "770995082704",
  appId: "1:770995082704:web:f0c0635ca9acc36bd815d5",
  measurementId: "G-Y3L9P65T2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
//const analytics = getAnalytics(app);