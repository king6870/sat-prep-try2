'use client'

import { useSession } from 'next-auth/react'
import SignInButton from '@/components/auth/SignInButton'

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
              <h1 className="text-2xl font-bold text-gray-900">SAT Prep</h1>
            </div>
            <SignInButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {session ? (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Welcome to SAT Prep, {session.user?.name}!
            </h2>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Dashboard
              </h3>
              <p className="text-gray-700 mb-6 text-base">
                This is where your SAT preparation journey begins. Features coming soon:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-base">📚 Practice Tests</h4>
                  <p className="text-sm text-gray-700 mt-1">Full-length SAT practice tests</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-base">📊 Analytics</h4>
                  <p className="text-sm text-gray-700 mt-1">Track your progress and performance</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-base">🎯 Question Bank</h4>
                  <p className="text-sm text-gray-700 mt-1">Thousands of practice questions</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-base">⚡ Custom Tests</h4>
                  <p className="text-sm text-gray-700 mt-1">Build your own practice tests</p>
                </div>
              </div>
              {session.user?.role === 'ADMIN' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
                  <h4 className="font-semibold text-red-900 text-base">🔧 Admin Panel</h4>
                  <p className="text-sm text-red-800 mt-1">Manage questions, users, and content</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Master Your SAT Score
            </h2>
            <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto font-medium">
              Comprehensive SAT preparation with practice tests, detailed analytics, 
              and personalized learning paths to help you achieve your target score.
            </p>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Get Started Today
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-blue-100 border border-blue-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Practice Tests</h4>
                  <p className="text-gray-700 text-base">Take full-length, timed practice tests that simulate the real SAT experience</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 border border-green-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h4>
                  <p className="text-gray-700 text-base">Monitor your improvement with detailed analytics and performance insights</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 border border-purple-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Targeted Practice</h4>
                  <p className="text-gray-700 text-base">Focus on your weak areas with customized question sets and explanations</p>
                </div>
              </div>
              <div className="flex justify-center">
                <SignInButton />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">&copy; 2024 SAT Prep. Built with Next.js and NextAuth.js</p>
        </div>
      </footer>
    </div>
  )
}
