import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyArvQgA-KAQbRPM5YfEpq_TKzUxIwk5x3M",
  authDomain: "mabinogi-heroes-tracker.firebaseapp.com",
  projectId: "mabinogi-heroes-tracker",
  storageBucket: "mabinogi-heroes-tracker.firebasestorage.app",
  messagingSenderId: "192554586718",
  appId: "1:192554586718:web:451f6503ecd821cca3dacf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function useFirebase() {
  const [user, setUser] = useState(null);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return { user, loginWithGoogle, logout };
}
