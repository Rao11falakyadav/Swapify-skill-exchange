'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;

export default function FirebaseSetupHelper() {
  const [copied, setCopied] = useState(false);

  const copyRules = async () => {
    try {
      await navigator.clipboard.writeText(FIRESTORE_RULES);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Firebase Setup Required
          </CardTitle>
          <p className="text-gray-600">
            Your Swapify app needs Firebase configuration to work properly
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-800">Step 1: Update Firestore Rules</h3>
              <Badge variant="secondary">Required</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Click the link below to open your Firebase Console and update the database rules:
            </p>
            <Button 
              variant="outline" 
              className="w-full mb-3"
              onClick={() => window.open('https://console.firebase.google.com/project/swapify-skill-exchange/firestore/rules', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Firestore Rules
            </Button>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
              <div className="flex items-center justify-between mb-2">
                <span>Copy these rules:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyRules}
                  className="text-green-400 hover:text-green-300"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="whitespace-pre-wrap">{FIRESTORE_RULES}</pre>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Delete everything in the editor and paste these rules, then click "Publish"
            </p>
          </div>

          {/* Step 2 */}
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-800">Step 2: Enable Authentication</h3>
              <Badge variant="secondary">Required</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Enable Email/Password and Google sign-in methods:
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('https://console.firebase.google.com/project/swapify-skill-exchange/authentication/providers', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Authentication Settings
            </Button>
            <div className="mt-3 text-xs text-gray-500">
              <p>✅ Click "Email/Password" → Toggle "Enable" → Save</p>
              <p>✅ Click "Google" → Toggle "Enable" → Choose your email → Save</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border rounded-lg p-4 bg-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-800">Step 3: Refresh This Page</h3>
              <Badge variant="outline">Final Step</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              After completing steps 1 & 2, refresh this page to start using Swapify!
            </p>
            <Button 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh Page
            </Button>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Need help?</strong> This setup only takes 2 minutes and you'll only do it once.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              After setup, you can create accounts, add skills, search users, and chat!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
