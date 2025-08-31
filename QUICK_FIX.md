# 🚨 QUICK FIX - Firestore Permission Error

## The Problem
You're getting "Missing or insufficient permissions" because Firestore rules need to be updated.

## The Solution (2 minutes)

### Step 1: Open Firebase Console
Click this link: **https://console.firebase.google.com/project/swapify-skill-exchange/firestore/rules**

### Step 2: Replace the Rules
You'll see a text editor. **DELETE EVERYTHING** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Click "Publish"
Click the blue **"Publish"** button.

### Step 4: Enable Authentication
Click this link: **https://console.firebase.google.com/project/swapify-skill-exchange/authentication/providers**

1. Click **"Email/Password"** → Toggle **"Enable"** → Click **"Save"**
2. Click **"Google"** → Toggle **"Enable"** → Choose your email → Click **"Save"**

### Step 5: Test Your App
Go to **http://localhost:3001** and try signing up!

---

## ✅ That's it! Your app should work now.

The permission error will be gone and you can create accounts, add skills, search for users, and send messages.
