# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Swapify is a Next.js 15 web application for skill-swapping where users can teach what they know and learn what they want. The platform connects learners to exchange skills through real-time messaging, match-making, and session scheduling.

## Common Development Commands

### Development Server
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint (currently configured to ignore during builds)
```

### Testing Firebase Connection
```bash
node firebase-setup-check.js  # Check Firebase configuration
node test-firebase.js         # Test Firebase services
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **State Management**: React Context API for authentication
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes (login, signup)
│   ├── dashboard/         # Main user dashboard
│   ├── search/            # Partner discovery
│   ├── messages/          # Real-time messaging
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components (Button, Card, etc.)
│   ├── Navigation.tsx    # Main navigation component
│   └── FirebaseSetupHelper.tsx  # Development helper
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication state management
├── hooks/                # Custom React hooks
│   └── useMessages.ts    # Real-time messaging hooks
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   └── utils.ts          # General utilities
└── types/                # TypeScript type definitions
    └── index.ts          # All application types
```

### Key Architectural Patterns

**Authentication Flow**:
- AuthContext provides global authentication state
- Firebase Auth handles authentication with Google OAuth
- User profiles stored in Firestore with automatic document creation
- Online/offline status tracking with cleanup on logout

**Data Layer**:
- Firestore collections: `users`, `conversations`, `messages`
- Real-time subscriptions using `onSnapshot`
- Type-safe data access with TypeScript interfaces
- Development-friendly Firestore rules (needs tightening for production)

**Component Architecture**:
- Server components by default with `'use client'` for interactivity
- Radix UI primitives wrapped in consistent design system
- Responsive design with mobile-first approach
- Dark/light theme support via next-themes

### Firebase Configuration

The app uses environment variables for Firebase configuration:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

For development without Firebase, the app gracefully degrades with demo values and shows setup helpers.

### Type System

Comprehensive TypeScript types defined in `src/types/index.ts`:
- **User**: Profile data with skills, ratings, and status
- **Skill**: Categorized skills with levels and descriptions
- **Match**: User matching system for skill exchanges
- **Message/Conversation**: Real-time chat functionality
- **SwapSession**: Scheduled learning sessions
- **Notification**: System notifications

## Development Workflow

### Adding New Features
1. Define types in `src/types/index.ts` if needed
2. Create Firestore collections and update rules
3. Build UI components in `src/components/`
4. Add pages in `src/app/` following App Router conventions
5. Use existing patterns for authentication and data fetching

### Component Development
- Use shadcn/ui components for consistency
- Follow the established responsive design patterns
- Implement proper loading and error states
- Use Lucide React for icons

### Database Operations
- Use the custom hooks in `src/hooks/` for real-time data
- Follow the established patterns in `useMessages.ts`
- Update Firestore security rules when adding collections
- Handle offline states gracefully

### Styling Conventions
- Use Tailwind CSS utility classes
- Follow the established color scheme (blue primary)
- Use consistent spacing and typography scales
- Implement responsive design with breakpoint prefixes

## Key Implementation Notes

- **Build Configuration**: ESLint and TypeScript errors are ignored during builds for development flexibility
- **Firebase Setup**: Graceful degradation when Firebase isn't configured properly
- **Real-time Features**: Implemented using Firestore real-time listeners
- **Authentication**: Supports both email/password and Google OAuth
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Development Mode**: Includes debugging helpers and setup assistance

## Production Considerations

- Tighten Firestore security rules (currently permissive for development)
- Enable proper error tracking and logging
- Configure proper Firebase environment variables
- Add comprehensive testing suite
- Implement proper SEO optimization
- Add analytics and monitoring
