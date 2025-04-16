import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export function useFirebase() {
  const [user, setUser] = useState(null);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Google login failed", error);
      return null;
    }
  };

  const saveUserData = async (uid, data) => {
    try {
      await setDoc(doc(db, "users", uid), data);
    } catch (error) {
      console.error("Failed to save user data", error);
    }
  };

  const updateUserData = async (uid, data) => {
    try {
      await updateDoc(doc(db, "users", uid), data);
    } catch (error) {
      console.error("Failed to update user data", error);
    }
  };

  const loadUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Failed to load user data", error);
      return null;
    }
  };

  return {
    user,
    loginWithGoogle,
    saveUserData,
    updateUserData,
    loadUserData,
  };
}
