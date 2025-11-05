// src/routes/user/Quizzes.tsx
'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserService } from '@/services/user.service'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Target, Clock } from 'lucide-react'
import type { QuizSummary } from '@/types/quiz'

export default function UserQuizzes() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadQuizzes = async () => {
    setLoading(true)
    const res = await UserService.userQuizService.getAll({
      search,
      category,
      difficulty,
      page: pagination.page,
      limit: pagination.limit
    })
    if (res) {
      setQuizzes(res.quizzes)
      setPagination(res.pagination)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadQuizzes()
  }, [search, category, difficulty, pagination.page])

  const categories = [...new Set(quizzes.map(q => q.category))]

  const difficultyColor = (d: string) => {
    const map: Record<string, string> = {
      Beginner: 'bg-green-100 text-green-700',
      Intermediate: 'bg-yellow-100 text-yellow-700',
      Advanced: 'bg-red-100 text-red-700'
    }
    return map[d] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Available Quizzes
        </h1>
        <p className="text-muted-foreground">Choose a quiz to test your knowledge</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={v => setCategory(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={v => setDifficulty(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : quizzes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No quizzes found
          </div>
        ) : (
          quizzes.map(quiz => (
            <Card key={quiz._id} className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/user/quiz/${quiz._id}`)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary">{quiz.category}</Badge>
                  <Badge className={difficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {quiz.description}
                </p>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {quiz.questionCount} questions
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {Math.floor(quiz.timeLimit / 60)} min
                  </div>
                </div>
                <Button className="w-full" variant="default">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page * pagination.limit >= pagination.total}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}