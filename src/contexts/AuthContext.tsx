'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const FirebaseSetupHelper = dynamic(() => import('@/components/FirebaseSetupHelper'), {
  ssr: false
});
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  firebaseError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { id: uid, ...userDoc.data() } as User;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions')) {
        setFirebaseError('firestore-permissions');
      }
      return null;
    }
  };

  // Create user document in Firestore
  const createUserDocument = async (
    user: FirebaseUser,
    additionalData?: any
  ): Promise<User> => {
    const userRef = doc(db, 'users', user.uid);
    const timestamp = Timestamp.now();
    
    const userData: Omit<User, 'id'> = {
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      bio: '',
      location: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      skillsOffered: [],
      skillsWanted: [],
      rating: 0,
      totalSwaps: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      isOnline: true,
      lastSeen: timestamp,
      ...additionalData,
    };

    await setDoc(userRef, userData);
    return { id: user.uid, ...userData };
  };

  // Authentication methods
  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      await createUserDocument(user, { displayName });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Check if user document exists, if not create it
      const existingUserData = await fetchUserData(user.uid);
      if (!existingUserData) {
        await createUserDocument(user);
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Update user's online status
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          isOnline: false,
          lastSeen: Timestamp.now(),
        });
      }
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(userRef, updateData);
      
      // Update local state
      if (userData) {
        setUserData({ ...userData, ...updateData } as User);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    // Set a timeout to ensure loading doesn't hang indefinitely
    const loadingTimeout = setTimeout(() => {
      console.log('Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 10000); // 10 seconds timeout

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          
          // Fetch user data from Firestore
          const userData = await fetchUserData(user.uid);
          setUserData(userData);
          
          // Update online status
          if (userData) {
            try {
              await updateDoc(doc(db, 'users', user.uid), {
                isOnline: true,
                lastSeen: Timestamp.now(),
              });
            } catch (error) {
              console.log('Failed to update online status:', error);
            }
          }
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  // Update online status when window closes
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          isOnline: false,
          lastSeen: Timestamp.now(),
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser]);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    firebaseError,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };

  // Show setup helper if there are Firebase permission issues
  if (firebaseError === 'firestore-permissions') {
    return <FirebaseSetupHelper />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
