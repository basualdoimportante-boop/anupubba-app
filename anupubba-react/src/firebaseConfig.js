// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrWSoFcjOgMzUM2IW_2Qa9EiNf--eN_Mc",
  authDomain: "anupubba-bienestar.firebaseapp.com",
  projectId: "anupubba-bienestar",
  storageBucket: "anupubba-bienestar.firebasestorage.app",
  messagingSenderId: "612523479029",
  appId: "1:612523479029:web:643a46d527295ee9315abc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);