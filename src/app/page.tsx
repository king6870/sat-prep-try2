'use client'

import { useSession } from 'next-auth/react'
import SignInButton from '@/components/auth/SignInButton'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 SAT Prep Master</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo"
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
              >
                🎮 Try Demo
              </Link>
              <SignInButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-gray-900 mb-8">
            🎯 Master Your SAT Score
          </h2>
          
          {/* Demo Section - Always Visible */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              🎮 Try Our Demo - No Login Required!
            </h3>
            <p className="text-gray-700 mb-4">
              Experience our complete SAT test-taking module with 5,000+ real questions, 
              timer functionality, and detailed analytics.
            </p>
            <Link
              href="/demo"
              className="inline-block py-3 px-6 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            >
              🚀 Start Demo Test Now
            </Link>
          </div>
          
          {session ? (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome back, {session.user?.name}! 📚
              </h3>
              <p className="text-gray-700 mb-6 text-lg">
                Ready to continue your SAT preparation journey? Let&apos;s achieve your target score! 🎉
              </p>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <p className="text-green-800 font-medium">
                  ✅ Authentication successful - You&apos;re ready to start!
                </p>
                <p className="text-green-700 text-sm mt-2">
                  User ID: {(session.user as any)?.id || 'Loading...'}
                </p>
                <p className="text-green-700 text-sm">
                  Email: {session.user?.email}
                </p>
              </div>
              
              {/* Practice Test Button */}
              <div className="mb-6">
                <Link
                  href="/practice-test"
                  className="inline-block w-full py-4 px-6 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  🚀 Start Practice Test (5,000+ Questions)
                </Link>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/practice-test" className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <h4 className="font-semibold text-gray-900 text-base">📝 Practice Tests</h4>
                  <p className="text-sm text-gray-700 mt-1">Full-length SAT practice exams with timer</p>
                </Link>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-base">📊 Score Analytics</h4>
                  <p className="text-sm text-gray-700 mt-1">Track your progress and improvement</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-base">🎯 Question Bank</h4>
                  <p className="text-sm text-gray-700 mt-1">5,000+ realistic SAT questions</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-base">⚡ Study Plans</h4>
                  <p className="text-sm text-gray-700 mt-1">Personalized study schedules</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Start Your SAT Success Journey! 📚
              </h3>
              <p className="text-xl text-gray-700 mb-8">
                Join thousands of students who have improved their SAT scores with our comprehensive prep platform.
              </p>
              <div className="flex justify-center">
                <SignInButton />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">📚 SAT Prep Master © 2024 - Your Path to College Success</p>
        </div>
      </footer>
    </div>
  )
}
