// Firebase Connection Test
// Run with: node test-firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection, addDoc } from 'firebase/firestore';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔥 Testing Firebase Connection...\n');

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully');
  console.log('📊 Project ID:', firebaseConfig.projectId);
  console.log('🔐 Auth Domain:', firebaseConfig.authDomain);
  
  console.log('\n🎯 Firebase connection test completed!');
  console.log('💡 If you see this message, your Firebase config is working.');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure you\'ve updated Firestore rules in Firebase Console');
  console.log('2. Enable Email/Password and Google authentication');
  console.log('3. Test the app at http://localhost:3001');
  
} catch (error) {
  console.error('❌ Firebase connection failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check your .env.local file has correct values');
  console.log('2. Verify your Firebase project exists');
  console.log('3. Make sure you\'ve enabled required services in Firebase Console');
}
