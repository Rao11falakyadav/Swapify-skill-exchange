// Firebase Setup Verification Script
// Run with: node firebase-setup-check.js

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('🔥 Firebase Configuration Check\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

let allConfigured = true;

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  const isConfigured = value && 
    !value.includes('your_') && 
    !value.includes('...') && 
    value !== 'your_project_id' &&
    value !== 'your_api_key_here';
  
  console.log(`${isConfigured ? '✅' : '❌'} ${envVar}: ${isConfigured ? 'Configured' : 'NOT CONFIGURED'}`);
  
  if (!isConfigured) {
    allConfigured = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allConfigured) {
  console.log('🎉 All Firebase environment variables are configured!');
  console.log('✅ You can now run: npm run dev');
} else {
  console.log('❌ Some environment variables need to be configured.');
  console.log('📝 Please update your .env.local file with values from Firebase Console.');
  console.log('🔗 Get config from: https://console.firebase.google.com/');
}

console.log('\n🔥 Firebase Console: https://console.firebase.google.com/');
console.log('📖 Setup Guide: Check PROJECT_SUMMARY.md for detailed instructions');
