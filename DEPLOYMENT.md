# 🚀 Deployment Guide for Swapify

This guide covers deploying Swapify to production using Vercel and Firebase.

## Prerequisites

Before deploying, ensure you have:
- ✅ Firebase project set up with Authentication and Firestore
- ✅ GitHub repository with your code
- ✅ Vercel account (free tier works)
- ✅ All environment variables configured

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable Email/Password provider
3. Enable Google provider (add your domain when prompted)

### 3. Set up Firestore Database
1. Go to Firestore Database
2. Create database in production mode
3. Start with default rules (we'll update them)

### 4. Configure Firestore Security Rules
Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other users for search
    }
    
    // Conversations can be read/written by participants
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages can be read/written by conversation participants
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Get Firebase Configuration
1. Go to Project Settings → General
2. Scroll to "Your apps" and click Web icon
3. Register your app and copy the config object

## Vercel Deployment

### 1. Connect Repository
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### 2. Configure Environment Variables
Add these environment variables in Vercel dashboard:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be available at `your-app-name.vercel.app`

### 4. Update Firebase Auth Domains
1. Go to Firebase Authentication → Settings
2. Add your Vercel domain to "Authorized domains"

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test profile setup flow
- [ ] Test search functionality
- [ ] Test messaging system
- [ ] Verify responsive design on mobile
- [ ] Check browser console for errors

## Custom Domain (Optional)

### 1. Add Domain in Vercel
1. Go to your project in Vercel
2. Settings → Domains
3. Add your custom domain

### 2. Configure DNS
Point your domain to Vercel:
- A Record: `76.76.19.61`
- AAAA Record: `2600:1f18:7be4:dd:0:0:0:28`

### 3. Update Firebase Settings
Add your custom domain to Firebase authorized domains.

## Monitoring & Analytics

### Performance Monitoring
- Use Vercel Analytics (built-in)
- Monitor Core Web Vitals

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for user session recording

### Firebase Analytics
- Enable Firebase Analytics in console
- Monitor user engagement and retention

## Environment-Specific Configs

### Production Optimizations
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google profile images
  },
}

module.exports = nextConfig
```

### Security Headers
Add in `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ]
},
```

## Troubleshooting

### Common Issues

**Build Failures**
- Check all imports are correct
- Ensure all dependencies are in package.json
- Verify TypeScript errors are resolved

**Authentication Issues**
- Verify Firebase config is correct
- Check authorized domains in Firebase
- Ensure environment variables are set

**Firestore Permission Errors**
- Review security rules
- Check user authentication state
- Verify collection/document structure

### Getting Help

1. Check [Next.js deployment docs](https://nextjs.org/docs/deployment)
2. Review [Firebase docs](https://firebase.google.com/docs)
3. Check [Vercel support](https://vercel.com/support)

## Scaling Considerations

As your app grows:
- Implement Firebase Functions for server-side logic
- Consider upgrading Firebase plan for higher limits
- Optimize Firestore queries with composite indexes
- Implement proper caching strategies
- Consider CDN for static assets

---

**🎉 Your Swapify app is now live!** Share the link and start building your skill-swapping community.
