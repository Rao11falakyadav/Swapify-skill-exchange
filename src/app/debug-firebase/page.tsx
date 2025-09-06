'use client';

import { useEffect, useState } from 'react';

export default function DebugFirebase() {
  const [status, setStatus] = useState<any>({});
  
  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test 1: Check if Firebase modules load
        const { initializeApp } = await import('firebase/app');
        const { getAuth, signInAnonymously } = await import('firebase/auth');
        
        setStatus(prev => ({ ...prev, modulesLoaded: true }));
        
        // Test 2: Check config values
        const config = {
          apiKey: 'AIzaSyCzwxgYUlbVrYvqWRdgYShmk11sAUb7Dxg',
          authDomain: 'swapify-skill-exchange.firebaseapp.com',
          projectId: 'swapify-skill-exchange',
          storageBucket: 'swapify-skill-exchange.firebasestorage.app',
          messagingSenderId: '101689407304',
          appId: '1:101689407304:web:3c48f8ea0ade4639ec257d',
        };
        
        setStatus(prev => ({ ...prev, config, configSet: true }));
        
        // Test 3: Initialize Firebase
        const app = initializeApp(config);
        setStatus(prev => ({ ...prev, appInitialized: true }));
        
        // Test 4: Initialize Auth
        const auth = getAuth(app);
        setStatus(prev => ({ ...prev, authInitialized: true }));
        
        // Test 5: Try anonymous sign in (this will test API key validity)
        await signInAnonymously(auth);
        setStatus(prev => ({ ...prev, authWorking: true }));
        
      } catch (error: any) {
        setStatus(prev => ({ 
          ...prev, 
          error: error.message,
          errorCode: error.code,
          fullError: JSON.stringify(error, null, 2)
        }));
      }
    };
    
    testFirebase();
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔥 Firebase Debug Test</h1>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded ${status.modulesLoaded ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-400'} border`}>
            <h3 className="font-semibold">1. Modules Loaded</h3>
            <p>{status.modulesLoaded ? '✅ Success' : '⏳ Loading...'}</p>
          </div>
          
          <div className={`p-4 rounded ${status.configSet ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-400'} border`}>
            <h3 className="font-semibold">2. Config Set</h3>
            <p>{status.configSet ? '✅ Success' : '⏳ Loading...'}</p>
          </div>
          
          <div className={`p-4 rounded ${status.appInitialized ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-400'} border`}>
            <h3 className="font-semibold">3. App Initialized</h3>
            <p>{status.appInitialized ? '✅ Success' : '⏳ Loading...'}</p>
          </div>
          
          <div className={`p-4 rounded ${status.authInitialized ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-400'} border`}>
            <h3 className="font-semibold">4. Auth Initialized</h3>
            <p>{status.authInitialized ? '✅ Success' : '⏳ Loading...'}</p>
          </div>
          
          <div className={`p-4 rounded ${status.authWorking ? 'bg-green-100 border-green-400' : status.error ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-400'} border`}>
            <h3 className="font-semibold">5. Auth Working</h3>
            <p>{status.authWorking ? '✅ Success' : status.error ? '❌ Failed' : '⏳ Testing...'}</p>
          </div>
        </div>
        
        {status.config && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h3 className="font-semibold mb-2">Firebase Config</h3>
            <pre className="text-xs overflow-x-auto">{JSON.stringify(status.config, null, 2)}</pre>
          </div>
        )}
        
        {status.error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h3 className="font-semibold mb-2 text-red-800">❌ Error Details</h3>
            <p className="text-red-700 mb-2"><strong>Message:</strong> {status.error}</p>
            <p className="text-red-700 mb-2"><strong>Code:</strong> {status.errorCode}</p>
            <pre className="text-xs overflow-x-auto text-red-600">{status.fullError}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
