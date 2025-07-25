'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DebugPage() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-tables')
      const data = await response.json()
      setDbStatus(data)
    } catch {
      setDbStatus({
        success: false,
        error: 'Failed to connect to API'
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔧 Debug & Fix SAT Prep Authentication
          </h1>
          
          <div className="space-y-6">
            {/* Database Check */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Database Tables Check
              </h2>
              <p className="text-gray-600 mb-4">
                The error &quot;Account table does not exist&quot; means we need to create database tables for the SAT prep platform.
              </p>
              <button
                onClick={checkDatabase}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating Tables...' : 'Create Database Tables'}
              </button>
              
              {dbStatus && (
                <div className={`mt-4 p-4 rounded-lg ${dbStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-semibold ${dbStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                    {dbStatus.success ? '✅ Success' : '❌ Error'}
                  </h3>
                  <p className={`mt-2 ${dbStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                    {dbStatus.message || dbStatus.error}
                  </p>
                  {dbStatus.tables && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Tables created:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {dbStatus.tables.map((table: string) => (
                          <li key={table}>{table}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Environment Variables */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. Environment Variables Check
              </h2>
              <p className="text-gray-600 mb-4">
                Make sure these are set in your Vercel project for the SAT prep platform:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                <div>DATABASE_URL=your-prisma-connection-string</div>
                <div>NEXTAUTH_URL=https://sat-prep-website.vercel.app</div>
                <div>NEXTAUTH_SECRET=your-secret-key</div>
                <div>GOOGLE_CLIENT_ID=50307876793-tpmb4m8iopq9gu8clgfa9n4egnmgtibj.apps.googleusercontent.com</div>
                <div>GOOGLE_CLIENT_SECRET=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</div>
              </div>
            </div>

            {/* Google OAuth Setup */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. Google OAuth Setup
              </h2>
              <p className="text-gray-600 mb-4">
                Make sure your Google Cloud Console has this redirect URI for the SAT prep platform:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                https://sat-prep-website.vercel.app/api/auth/callback/google
              </div>
            </div>

            {/* Test Authentication */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. Test SAT Prep Authentication
              </h2>
              <p className="text-gray-600 mb-4">
                After creating tables, test the authentication for the SAT prep platform:
              </p>
              <div className="space-x-4">
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  📚 Go to SAT Prep Homepage
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  🔐 Test Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
