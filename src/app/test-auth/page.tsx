'use client'

import { signIn } from 'next-auth/react'

export default function TestAuth() {
  const handleSignIn = () => {
    signIn('google', { 
      callbackUrl: '/',
      redirect: true 
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🔧 Test Authentication
          </h2>
          <p className="text-gray-600 mb-8">
            This is a simple test page to debug Google OAuth
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
            >
              🦆 Test Google Sign In
            </button>
            
            <div className="text-sm text-gray-500">
              <p>This should redirect to Google and back</p>
              <p>If you get a cookie error, check the logs</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
              <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Environment: {process.env.NODE_ENV || 'development'}</li>
                <li>• URL: {typeof window !== 'undefined' ? window.location.origin : 'server'}</li>
                <li>• Cookies: Configured for production HTTPS</li>
                <li>• State cookie: Should persist during OAuth flow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
