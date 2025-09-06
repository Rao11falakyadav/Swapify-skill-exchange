'use client';

import { useEffect, useState } from 'react';

export default function FirebaseEnvDebug() {
  const [envVars, setEnvVars] = useState<any>({});
  
  useEffect(() => {
    // Check if environment variables are loaded
    const vars = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'LOADED' : 'MISSING',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'LOADED' : 'MISSING', 
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'LOADED' : 'MISSING',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'LOADED' : 'MISSING',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'LOADED' : 'MISSING',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'LOADED' : 'MISSING',
      
      // Show actual values for debugging (first few chars only)
      apiKeyPreview: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
      projectIdValue: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };
    
    setEnvVars(vars);
  }, []);

  // Only show in development or when there are issues
  const shouldShow = process.env.NODE_ENV === 'development' || 
                     envVars.apiKey === 'MISSING';

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 p-4 rounded max-w-sm text-xs z-50">
      <h3 className="font-bold text-red-800 mb-2">🔥 Firebase Env Debug</h3>
      <div className="space-y-1 text-red-700">
        <div>API Key: <span className={envVars.apiKey === 'LOADED' ? 'text-green-600' : 'text-red-600'}>{envVars.apiKey}</span></div>
        <div>Auth Domain: <span className={envVars.authDomain === 'LOADED' ? 'text-green-600' : 'text-red-600'}>{envVars.authDomain}</span></div>
        <div>Project ID: <span className={envVars.projectId === 'LOADED' ? 'text-green-600' : 'text-red-600'}>{envVars.projectId}</span></div>
        <div>Storage: <span className={envVars.storageBucket === 'LOADED' ? 'text-green-600' : 'text-red-600'}>{envVars.storageBucket}</span></div>
        <div>Messaging: <span className={envVars.messagingSenderId === 'LOADED' ? 'text-green-600' : 'text-red-600'}>{envVars.messagingSenderId}</span></div>
        <div>App ID: <span className={envVars.appId === 'LOADED' ? 'text-green-600' : 'text-red-600'}>{envVars.appId}</span></div>
        {envVars.apiKeyPreview && (
          <div className="mt-2 pt-2 border-t border-red-300">
            <div>API Preview: {envVars.apiKeyPreview}</div>
            <div>Project: {envVars.projectIdValue}</div>
          </div>
        )}
      </div>
    </div>
  );
}
