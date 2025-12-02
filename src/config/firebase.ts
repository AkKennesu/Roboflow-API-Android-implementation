import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkCZpqfymCYHdtT2FMV_1hpBF3lH67f5s",
  authDomain: "riceplant-diseases.firebaseapp.com",
  projectId: "riceplant-diseases",
  storageBucket: "riceplant-diseases.firebasestorage.app",
  messagingSenderId: "155369869924",
  appId: "1:155369869924:android:653c06d8341ff83dc08571"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
