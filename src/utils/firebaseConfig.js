// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDoRZkP0XLxf-csFi5RMPgr93t7rDOCulI",
  authDomain: "venturecapital-8f713.firebaseapp.com",
  projectId: "venturecapital-8f713",
  storageBucket: "venturecapital-8f713.appspot.com",
  messagingSenderId: "751427992845",
  appId: "1:751427992845:web:7ad27d4c3e03e4b5cc4444"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const database = getFirestore(firebase);