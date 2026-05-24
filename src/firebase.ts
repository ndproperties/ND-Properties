import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration. Uses Vite env variables with sensible fallbacks 
// referencing your spring-dominion-mk9gj project.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyApiKeyForLocalDevelopmentOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "spring-dominion-mk9gj.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "spring-dominion-mk9gj",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "spring-dominion-mk9gj.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1028759247659",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1028759247659:web:5ee7f1c1f75d5a7d7cbdf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Provider with the Google Meet OAuth scope
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/meet");

// Prompt account selection to make switching accounts easier
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export interface AuthResult {
  user: User | null;
  accessToken: string | null;
  error: string | null;
}

/**
 * Initiates Google Sign-In via popup with appropriate scopes.
 * Handles common errors like popup closures gracefully.
 */
export async function loginWithGoogle(): Promise<AuthResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    return {
      user: result.user,
      accessToken,
      error: null
    };
  } catch (error: any) {
    let friendlyMessage = "Failed to authenticate Google.";
    
    // Graceful checks for popup closures and blocker issues
    if (error.code === "auth/popup-closed-by-user") {
      friendlyMessage = "The sign-in popup was closed before completion. Please click login again to retry.";
    } else if (error.code === "auth/cancelled-popup-request") {
      friendlyMessage = "Sign-in window request was cancelled. Please close other login windows and try again.";
    } else if (error.code === "auth/popup-blocked") {
      friendlyMessage = "The login popup was blocked by your browser. Please enable popups for this site.";
    } else if (error.message) {
      friendlyMessage = error.message;
    }
    
    console.warn("Firebase Auth Warning Code:", error.code);
    return {
      user: null,
      accessToken: null,
      error: friendlyMessage
    };
  }
}

/**
 * Signs the user out of the application.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}
