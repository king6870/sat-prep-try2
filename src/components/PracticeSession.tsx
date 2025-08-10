'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Target } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  pointAmount: number;
  category: string;
  difficulty: string;
}

interface PracticeSessionProps {
  category?: string;
  difficulty?: string;
  questionCount?: number;
}

export default function PracticeSession({ 
  category = 'all', 
  difficulty = 'all', 
  questionCount = 10 
}: PracticeSessionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    fetchQuestions();
    setStartTime(new Date());
  }, [category, difficulty, questionCount]);

  useEffect(() => {
    if (startTime && !isComplete) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isComplete]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: questionCount.toString(),
        random: 'true'
      });
      
      if (category !== 'all') params.append('category', category);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      
      const response = await fetch(`/api/questions?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
      } else {
        console.error('Failed to fetch questions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedAnswer
    }));
    
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.pointAmount);
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowExplanation(false);
    setScore(0);
    setAnswers({});
    setIsComplete(false);
    setStartTime(new Date());
    setTimeSpent(0);
    fetchQuestions();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your SAT practice questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-4">No questions found for the selected criteria.</p>
          <Button onClick={fetchQuestions}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    const totalPossiblePoints = questions.reduce((sum, q) => sum + q.pointAmount, 0);
    const percentage = Math.round((score / totalPossiblePoints) * 100);
    
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Practice Session Complete! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-3xl font-bold text-blue-600">{percentage}%</span>
              </div>
              <p className="text-gray-600">Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-green-600">
                  {Object.values(answers).filter((answer, index) => 
                    answer === questions[index]?.answer
                  ).length}
                </span>
              </div>
              <p className="text-gray-600">Correct</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-purple-600 mr-2" />
                <span className="text-3xl font-bold text-purple-600">{formatTime(timeSpent)}</span>
              </div>
              <p className="text-gray-600">Time</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={handleRestart} size="lg">
              Practice Again
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/dashboard'}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
              {currentQuestion.difficulty}
            </Badge>
            <Badge variant="outline">{currentQuestion.category}</Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeSpent)}
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              {score} pts
            </div>
          </div>
        </div>
        <Progress value={progress} className="mb-4" />
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, index) => {
              const letter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === choice;
              const isCorrect = choice === currentQuestion.answer;
              const isIncorrect = showExplanation && isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(choice)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    showExplanation
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isIncorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-3">{letter}.</span>
                    <span>{choice}</span>
                    {showExplanation && isCorrect && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                    {showExplanation && isIncorrect && (
                      <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {showExplanation && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Explanation:</h4>
            <p className="text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">
            Points: {currentQuestion.pointAmount}
          </div>
          <div>
            {!showExplanation ? (
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={!selectedAnswer}
                className="px-8"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="px-8">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
