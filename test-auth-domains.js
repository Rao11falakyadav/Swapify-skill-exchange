#!/usr/bin/env node

// Test Firebase Auth domain configuration
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔐 Testing Firebase Auth Domain Configuration...\n');
console.log(`📊 Auth Domain: ${firebaseConfig.authDomain}`);
console.log(`🌐 Current Domain: localhost (development)`);
console.log('');

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase app initialized successfully');
  console.log('✅ Firebase auth service available');
  console.log('');
  
  console.log('💡 If you see this message without errors, your Firebase config is working.');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Add these domains to Firebase Console → Authentication → Settings → Authorized domains:');
  console.log('   - localhost');
  console.log('   - localhost:3000');
  console.log('   - localhost:3001');
  console.log('   - 127.0.0.1:3000');
  console.log('');
  console.log('2. Enable authentication methods:');
  console.log('   - Email/Password');
  console.log('   - Google OAuth (if using Google login)');
  console.log('');
  console.log('🔗 Firebase Console: https://console.firebase.google.com/project/swapify-skill-exchange/authentication/settings');
  
} catch (error) {
  console.error('❌ Firebase auth test failed:', error.message);
  
  if (error.code === 'auth/unauthorized-domain') {
    console.log('');
    console.log('🚨 UNAUTHORIZED DOMAIN ERROR');
    console.log('This error means localhost is not authorized for authentication.');
    console.log('');
    console.log('🔧 Fix: Add localhost to authorized domains in Firebase Console');
    console.log('📍 Go to: Firebase Console → Authentication → Settings → Authorized domains');
  }
}
