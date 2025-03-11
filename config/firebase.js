import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native'; // Fixed import path
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEeaWcozjuWmkj9zuYIGGSTTkC69Pa408",
  authDomain: "realtimechat-38588.firebaseapp.com",
  databaseURL: "https://realtimechat-38588-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "realtimechat-38588",
  storageBucket: "realtimechat-38588.appspot.com",
  messagingSenderId: "433334288159",
  appId: "1:433334288159:android:07343243d098b6f515fa2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb };