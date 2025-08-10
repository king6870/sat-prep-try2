'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PracticeSession from '@/components/PracticeSession';
import { BookOpen, Calculator, Target, Clock } from 'lucide-react';

interface QuestionStats {
  total: number;
  byCategory: { category: string; count: number }[];
  byDifficulty: { difficulty: string; count: number }[];
  bySubject: {
    math: {
      total: number;
      categories: { category: string; count: number }[];
    };
    reading: {
      total: number;
      categories: { category: string; count: number }[];
    };
  };
}

export default function PracticePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [showPractice, setShowPractice] = useState(false);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/questions/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = () => {
    setShowPractice(true);
  };

  const handleBackToSetup = () => {
    setShowPractice(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading practice options...</p>
        </div>
      </div>
    );
  }

  if (showPractice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={handleBackToSetup}>
            ← Back to Setup
          </Button>
        </div>
        <PracticeSession 
          category={selectedCategory}
          difficulty={selectedDifficulty}
          questionCount={questionCount}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SAT Practice</h1>
        <p className="text-gray-600">
          Practice with real SAT questions from our comprehensive question bank
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.bySubject.math.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Math Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.bySubject.reading.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Reading Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">~{Math.round(stats.total / 60)}</p>
                  <p className="text-sm text-gray-600">Hours of Content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Practice Setup */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Practice Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Subject Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Algebra">Algebra</SelectItem>
                    <SelectItem value="Arithmetic">Arithmetic</SelectItem>
                    <SelectItem value="Exponents">Exponents</SelectItem>
                    <SelectItem value="Functions">Functions</SelectItem>
                    <SelectItem value="Geometry">Geometry</SelectItem>
                    <SelectItem value="Statistics">Statistics</SelectItem>
                    <SelectItem value="Reading - Comprehension">Reading Comprehension</SelectItem>
                    <SelectItem value="Reading - Vocabulary">Reading Vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions (~5 min)</SelectItem>
                    <SelectItem value="10">10 Questions (~10 min)</SelectItem>
                    <SelectItem value="15">15 Questions (~15 min)</SelectItem>
                    <SelectItem value="20">20 Questions (~20 min)</SelectItem>
                    <SelectItem value="25">25 Questions (~25 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleStartPractice} className="w-full" size="lg">
                Start Practice Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Question Bank Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700">Math Categories</h4>
                    <div className="space-y-2">
                      {stats.bySubject.math.categories.map((cat) => (
                        <div key={cat.category} className="flex justify-between items-center">
                          <span className="text-sm">{cat.category}</span>
                          <Badge variant="outline">{cat.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-700">Reading Categories</h4>
                    <div className="space-y-2">
                      {stats.bySubject.reading.categories.map((cat) => (
                        <div key={cat.category} className="flex justify-between items-center">
                          <span className="text-sm">{cat.category.replace('Reading - ', '')}</span>
                          <Badge variant="outline">{cat.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-700">Difficulty Levels</h4>
                    <div className="space-y-2">
                      {stats.byDifficulty.map((diff) => (
                        <div key={diff.difficulty} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{diff.difficulty}</span>
                          <Badge variant="outline">{diff.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
