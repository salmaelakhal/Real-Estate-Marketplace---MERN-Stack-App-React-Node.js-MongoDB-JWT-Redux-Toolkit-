// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4ccb2.firebaseapp.com",
  projectId: "mern-estate-4ccb2",
  storageBucket: "mern-estate-4ccb2.firebasestorage.app",
  messagingSenderId: "415305338775",
  appId: "1:415305338775:web:1bf1828fab3a71ba01fed2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
