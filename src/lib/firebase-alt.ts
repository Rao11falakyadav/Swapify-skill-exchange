import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// Initialize Firebase services with error handling
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Configure providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Enhanced error handler for Firestore permission errors
export const handleFirestoreError = (error: any) => {
  console.error('Firestore Error:', error);
  
  if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions')) {
    console.log('🚨 FIRESTORE PERMISSION ERROR DETECTED');
    console.log('📝 Quick Fix Required:');
    console.log('1. Go to: https://console.firebase.google.com/project/swapify-skill-exchange/firestore/rules');
    console.log('2. Replace rules with: allow read, write: if request.auth != null;');
    console.log('3. Click Publish');
    console.log('4. Enable Authentication: https://console.firebase.google.com/project/swapify-skill-exchange/authentication/providers');
    
    // Show user-friendly message
    return {
      error: true,
      message: 'Database permissions need to be configured. Please check the console for setup instructions.',
      code: 'permission-denied'
    };
  }
  
  return {
    error: true,
    message: error?.message || 'An unknown error occurred',
    code: error?.code || 'unknown'
  };
};

export default app;
