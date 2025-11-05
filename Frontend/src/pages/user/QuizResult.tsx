// src/routes/user/QuizResult.tsx
'use client'

import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Target, Award, Star } from 'lucide-react'

export default function QuizResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, quizTitle, timeTaken } = location.state || {}

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <Button onClick={() => navigate('/user/quizzes')}>Back to Quizzes</Button>
        </div>
      </div>
    )
  }

  const getGrade = () => {
    if (result.percentage >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-700' }
    if (result.percentage >= 80) return { label: 'Very Good', color: 'bg-green-100 text-green-700' }
    if (result.percentage >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-700' }
    if (result.percentage >= 60) return { label: 'Pass', color: 'bg-blue-100 text-blue-700' }
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-700' }
  }

  const grade = getGrade()

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${grade.color} font-bold mb-4`}>
            {result.percentage >= 90 ? <Trophy className="h-5 w-5 mr-2" /> : <Award className="h-5 w-5 mr-2" />}
            {grade.label}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{result.percentage}%</h1>
          <p className="text-xl text-gray-600">{quizTitle}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{result.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {result.total - result.correct}
              </div>
              <div className="text-sm text-muted-foreground">Wrong</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{timeTaken / 60 | 0}:{(timeTaken % 60).toString().padStart(2, '0')}</div>
              <div className="text-sm text-muted-foreground">Time Taken</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/user/quizzes')} className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            Try Another Quiz
          </Button>
          <Button onClick={() => navigate('/user/dashboard')} className="flex-1">
            <Star className="h-4 w-4 mr-2" />
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}