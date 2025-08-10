'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import questions from '@/data/questions.json'

interface Question {
  question: string
  choices: string[]
  answer: string
  explanation: string
  point_amount: number
  category: string
}

interface UserAnswer {
  questionIndex: number
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number
}

export default function PracticeTest() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Test configuration
  const [testQuestions, setTestQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  
  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(3600) // 60 minutes in seconds
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  
  // Test settings
  const [testLength, setTestLength] = useState(20) // Default 20 questions
  const [testSubject, setTestSubject] = useState('all') // all, math, reading

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Timer effect
  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [testStarted, testCompleted, timeRemaining])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getFilteredQuestions = () => {
    let filtered = questions as Question[]
    
    if (testSubject !== 'all') {
      if (testSubject === 'math') {
        filtered = filtered.filter(q => 
          !q.category.toLowerCase().includes('reading')
        )
      } else if (testSubject === 'reading') {
        filtered = filtered.filter(q => 
          q.category.toLowerCase().includes('reading')
        )
      }
    }
    
    // Shuffle the array using Fisher-Yates algorithm for better randomization
    const shuffled = [...filtered]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // Take unique questions by creating a Set of question text to avoid duplicates
    const uniqueQuestions: Question[] = []
    const seenQuestions = new Set<string>()
    
    for (const question of shuffled) {
      if (!seenQuestions.has(question.question) && uniqueQuestions.length < testLength) {
        seenQuestions.add(question.question)
        uniqueQuestions.push(question)
      }
    }
    
    // If we don't have enough unique questions, fill with remaining ones
    if (uniqueQuestions.length < testLength) {
      for (const question of shuffled) {
        if (uniqueQuestions.length >= testLength) break
        if (!uniqueQuestions.some(q => q.question === question.question)) {
          uniqueQuestions.push(question)
        }
      }
    }
    
    return uniqueQuestions.slice(0, testLength)
  }

  const startTest = () => {
    const selectedQuestions = getFilteredQuestions()
    setTestQuestions(selectedQuestions)
    setTestStarted(true)
    setQuestionStartTime(Date.now())
    
    // Set timer based on test length (3 minutes per question)
    setTimeRemaining(testLength * 180)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    if (!selectedAnswer) return

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const currentQuestion = testQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.answer

    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      isCorrect,
      timeSpent
    }

    setUserAnswers(prev => [...prev, newAnswer])
    setSelectedAnswer('')
    setQuestionStartTime(Date.now())

    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleTestComplete()
    }
  }

  const handleTestComplete = () => {
    setTestCompleted(true)
  }

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const totalQuestions = testQuestions.length
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    
    // Calculate weak areas (categories where user got questions wrong)
    const weakAreas = userAnswers
      .filter(answer => !answer.isCorrect)
      .reduce((acc, answer) => {
        const category = testQuestions[answer.questionIndex].category
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    // Calculate category performance
    const categoryPerformance = userAnswers.reduce((acc, answer) => {
      const category = testQuestions[answer.questionIndex].category
      if (!acc[category]) {
        acc[category] = { correct: 0, total: 0, percentage: 0 }
      }
      acc[category].total++
      if (answer.isCorrect) {
        acc[category].correct++
      }
      acc[category].percentage = Math.round((acc[category].correct / acc[category].total) * 100)
      return acc
    }, {} as Record<string, { correct: number; total: number; percentage: number }>)
    
    return { correctAnswers, totalQuestions, percentage, weakAreas, categoryPerformance }
  }

  const restartTest = () => {
    setTestQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setSelectedAnswer('')
    setTestStarted(false)
    setTestCompleted(false)
    setTimeRemaining(3600)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const currentQuestion = testQuestions[currentQuestionIndex]
  const progress = testStarted ? ((currentQuestionIndex + 1) / testQuestions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">📚 SAT Practice Test</h1>
            {testStarted && !testCompleted && (
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-gray-700">
                  ⏱️ {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {testQuestions.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!testStarted ? (
          // Test Setup Screen
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🎯 Start Your SAT Practice Test
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  value={testLength}
                  onChange={(e) => setTestLength(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 Questions (30 minutes)</option>
                  <option value={20}>20 Questions (60 minutes)</option>
                  <option value={50}>50 Questions (2.5 hours)</option>
                  <option value={100}>100 Questions (5 hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Focus
                </label>
                <select
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Subjects (Mixed)</option>
                  <option value="math">Math Only</option>
                  <option value="reading">Reading Only</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📋 Test Instructions:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You have 3 minutes per question on average</li>
                  <li>• Questions are randomly selected from 5,000+ question bank</li>
                  <li>• Timer will automatically submit when time expires</li>
                  <li>• You can review your answers at the end</li>
                  <li>• Your progress will be tracked and scored</li>
                </ul>
              </div>

              <button
                onClick={startTest}
                className="w-full py-4 px-6 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                🚀 Start Practice Test
              </button>
            </div>
          </div>
        ) : testCompleted ? (
          // Results Screen
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🎉 Test Complete!
            </h2>
            
            {(() => {
              const { correctAnswers, totalQuestions, percentage, weakAreas, categoryPerformance } = calculateScore()
              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {percentage}%
                    </div>
                    <div className="text-xl text-gray-700">
                      {correctAnswers} out of {totalQuestions} correct
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                      <div className="text-sm text-green-700">Correct</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                      <div className="text-sm text-red-700">Incorrect</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(userAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0) / userAnswers.length)}s
                      </div>
                      <div className="text-sm text-blue-700">Avg Time</div>
                    </div>
                  </div>

                  {/* Performance by Category */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance by Category</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(categoryPerformance).map(([category, stats]) => (
                        <div key={category} className={`p-4 rounded-lg border-2 ${
                          stats.percentage >= 80 ? 'border-green-200 bg-green-50' :
                          stats.percentage >= 60 ? 'border-yellow-200 bg-yellow-50' :
                          'border-red-200 bg-red-50'
                        }`}>
                          <div className="font-medium text-gray-900">{category}</div>
                          <div className="text-sm text-gray-600">{stats.correct}/{stats.total} correct</div>
                          <div className={`text-lg font-bold ${
                            stats.percentage >= 80 ? 'text-green-600' :
                            stats.percentage >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {stats.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weak Areas - Practice Recommendations */}
                  {Object.keys(weakAreas).length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-orange-800 mb-4">
                        🎯 Areas for Improvement
                      </h3>
                      <p className="text-orange-700 text-sm mb-4">
                        Based on your incorrect answers, here are the categories you should focus on:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(weakAreas)
                          .sort(([,a], [,b]) => b - a) // Sort by number of incorrect answers
                          .map(([category, incorrectCount]) => {
                            const categoryStats = categoryPerformance[category]
                            return (
                              <div key={category} className="bg-white border border-orange-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-gray-900">{category}</h4>
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                    {incorrectCount} wrong
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                  Score: {categoryStats.percentage}% ({categoryStats.correct}/{categoryStats.total})
                                </div>
                                <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
                                  💡 <strong>Practice Tip:</strong> Take more {category.toLowerCase()} questions to improve in this area.
                                  {category.toLowerCase().includes('math') || category.toLowerCase().includes('algebra') || category.toLowerCase().includes('geometry') ? 
                                    ' Focus on understanding the underlying concepts and practice similar problem types.' :
                                    ' Read more passages in this category and practice identifying key information quickly.'
                                  }
                                </div>
                              </div>
                            )
                          })}
                      </div>
                      
                      {/* Practice Recommendations */}
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">📚 Recommended Next Steps:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Take a focused test on your weak categories</li>
                          <li>• Review explanations for questions you got wrong</li>
                          <li>• Practice 10-15 questions daily in your weak areas</li>
                          <li>• Retake this test in a few days to track improvement</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Strong Areas - Positive Reinforcement */}
                  {(() => {
                    const strongAreas = Object.entries(categoryPerformance)
                      .filter(([, stats]) => stats.percentage >= 80)
                      .sort(([,a], [,b]) => b.percentage - a.percentage)
                    
                    if (strongAreas.length > 0) {
                      return (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-green-800 mb-4">
                            🌟 Your Strong Areas
                          </h3>
                          <p className="text-green-700 text-sm mb-4">
                            Great job! You performed well in these categories:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {strongAreas.map(([category, stats]) => (
                              <div key={category} className="bg-white border border-green-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium text-gray-900">{category}</h4>
                                  <span className="text-lg font-bold text-green-600">{stats.percentage}%</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {stats.correct}/{stats.total} correct
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}

                  <div className="flex space-x-4">
                    <button
                      onClick={restartTest}
                      className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      🔄 Take Another Test
                    </button>
                    <button
                      onClick={() => router.push('/')}
                      className="flex-1 py-3 px-6 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      🏠 Back to Home
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        ) : (
          // Question Display Screen
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {currentQuestion?.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {testQuestions.length}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                  {currentQuestion?.question}
                </h3>
              </div>

              <div className="space-y-3 mb-8">
                {currentQuestion?.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(choice)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === choice
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)})
                    </span>
                    {choice}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Time on this question: {Math.floor((Date.now() - questionStartTime) / 1000)}s
                </div>
                <button
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                  className={`px-6 py-3 font-semibold rounded-md transition-colors duration-200 ${
                    selectedAnswer
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentQuestionIndex < testQuestions.length - 1 ? 'Next Question →' : 'Finish Test 🏁'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
