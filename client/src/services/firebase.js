// client/src/services/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5Y5Rr14dgTET7eRBYQZFksyex4TDGK9c",
  authDomain: "study-plan-okcu.firebaseapp.com",
  projectId: "study-plan-okcu",
  storageBucket: "study-plan-okcu.firebasestorage.app",
  messagingSenderId: "756565855",
  appId: "1:756565855:web:36a71a58cf9959c7e5d8ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update profile with display name
  await updateProfile(userCredential.user, {
    displayName
  });
  
  return userCredential;
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}; 

export const logoutUser = () => {
  return signOut(auth);
};

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export { auth, db };