'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentSessions, setRecentSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/')
      return
    }

    // Fetch recent sessions
    fetchRecentSessions()
  }, [session, status, router])

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/test-sessions/recent')
      if (response.ok) {
        const data = await response.json()
        setRecentSessions(data.recentSessions || [])
      }
    } catch (error) {
      console.error('Error fetching recent sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                📚 SAT Prep Master
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={session.user?.image || ''}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">{session.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {session.user?.name?.split(' ')[0]}! Ready to continue your SAT prep?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Practice Test</h3>
                <p className="text-gray-600 text-sm">Full SAT practice with 5,000+ questions</p>
              </div>
            </div>
            <Link
              href="/practice-test"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block text-center"
            >
              Start Practice Test
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <span className="text-2xl">🎮</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Demo Test</h3>
                <p className="text-gray-600 text-sm">Try our demo with no time limits</p>
              </div>
            </div>
            <Link
              href="/demo"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 inline-block text-center"
            >
              Try Demo
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                <p className="text-gray-600 text-sm">Track your improvement over time</p>
              </div>
            </div>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{session.testType}</h3>
                      <p className="text-sm text-gray-600">{session.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{session.score}%</p>
                      <p className="text-sm text-gray-600">{session.questionsAnswered} questions</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <span className="text-4xl mb-4 block">🚀</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to start your SAT prep journey?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Take your first practice test to see where you stand and track your progress.
                  </p>
                  <Link
                    href="/practice-test"
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block"
                  >
                    Take Your First Test
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Study Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Study Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">📅 Consistent Practice</h3>
              <p className="text-sm text-gray-600">
                Take practice tests regularly to build stamina and identify weak areas.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">⏰ Time Management</h3>
              <p className="text-sm text-gray-600">
                Practice with our timer to get comfortable with SAT time constraints.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">📝 Review Mistakes</h3>
              <p className="text-sm text-gray-600">
                Always review explanations for questions you got wrong to learn from errors.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">🎯 Focus Areas</h3>
              <p className="text-sm text-gray-600">
                Use our analytics to identify and focus on your weakest subject areas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
