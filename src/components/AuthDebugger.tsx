'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebugger() {
  const { currentUser, userData, loading, firebaseError } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
      <strong className="font-bold">Auth Debug Info:</strong>
      <ul className="text-sm mt-2">
        <li>Loading: {loading ? 'true' : 'false'}</li>
        <li>Current User: {currentUser ? currentUser.email : 'null'}</li>
        <li>User Data: {userData ? 'exists' : 'null'}</li>
        <li>Firebase Error: {firebaseError || 'none'}</li>
      </ul>
    </div>
  );
}
