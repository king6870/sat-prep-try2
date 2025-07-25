'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DatabaseStatus() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/migrate')
      const data = await response.json()
      setStatus(data)
    } catch {
      setStatus({
        success: false,
        error: 'Failed to connect to migration API'
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🗄️ Database Migration Status
          </h1>
          
          <div className="mb-6">
            <button
              onClick={checkDatabase}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Database & Run Migration'}
            </button>
          </div>

          {status && (
            <div className={`p-4 rounded-lg ${status.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h2 className={`text-lg font-semibold mb-2 ${status.success ? 'text-green-800' : 'text-red-800'}`}>
                {status.success ? '✅ Success' : '❌ Error'}
              </h2>
              
              <p className={`mb-4 ${status.success ? 'text-green-700' : 'text-red-700'}`}>
                {status.message || status.error}
              </p>

              {status.timestamp && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Timestamp:</strong> {new Date(status.timestamp).toLocaleString()}
                </p>
              )}

              {status.tables && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Database Tables:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {status.tables.map((table: string) => (
                      <li key={table}>{table}</li>
                    ))}
                  </ul>
                </div>
              )}

              {status.note && (
                <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                  <strong>Note:</strong> {status.note}
                </p>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  View Raw Response
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(status, null, 2)}
                </pre>
              </details>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📋 Migration Instructions
            </h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Make sure your Prisma DATABASE_URL is set in Vercel environment variables</li>
              <li>Click &quot;Check Database &amp; Run Migration&quot; above</li>
              <li>If successful, your database is ready for authentication</li>
              <li>Test Google OAuth sign-in on the main page</li>
            </ol>
          </div>

          <div className="mt-6 flex space-x-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              ← Back to Home
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Test Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
