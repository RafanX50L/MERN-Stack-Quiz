// src/services/userDashboard.service.ts
import { toast } from 'sonner'
import api from './api'
import { USER_ROUTES } from '@/constants/routes'
import type { QuizDetail, QuizSummary, SubmitResult } from '@/types/quiz'

export type UserDashboardData = {
  stats: {
    totalQuizzes: number
    avgScore: number
    bestScore: number
  }
  recentResults: Array<{
    quizId: string
    title: string
    category: string
    score: number
    date: string
  }>
  charts: {
    attemptsOverTime: Array<{ date: string; attempts: number }>
    scoreDistribution: Array<{ range: string; count: number }>
    categoryPerformance: Array<{ category: string; attempts: number; avgScore: number }>
  }
}
export type PaginatedQuizzes = {
  quizzes: QuizSummary[]
  pagination: { page: number; limit: number; total: number }
}
export const UserService = {
  getDashboard: async (userId: string): Promise<UserDashboardData | null> => {
    try {
      const res = await api.get<{ data: UserDashboardData }>(USER_ROUTES.DASHBOARD(userId))
      return res.data.data
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to load dashboard'
      toast.error(msg)
      return null
    }
  },
  userQuizService: {
    getAll: async (filters?: {
      category?: string
      difficulty?: string
      search?: string
      page?: number
      limit?: number
    }): Promise<PaginatedQuizzes | null> => {
      try {
        const params = new URLSearchParams()
        if (filters?.category) params.append('category', filters.category)
        if (filters?.difficulty) params.append('difficulty', filters.difficulty)
        if (filters?.search) params.append('search', filters.search)
        if (filters?.page) params.append('page', filters.page.toString())
        if (filters?.limit) params.append('limit', filters.limit.toString())

        const res = await api.get<{ data: PaginatedQuizzes }>(`${USER_ROUTES.USER_QUIZ_ROUTES.GET_ALL}?${params}`)
        return res.data.data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to load quizzes : ${errorMessage}`)
        return null
      }
    },

    getById: async (id: string): Promise<QuizDetail | null> => {
      try {
        const res = await api.get<{ data: QuizDetail }>(USER_ROUTES.USER_QUIZ_ROUTES.GET_BY_ID(id))
        return res.data.data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Quiz not found : ${errorMessage}`)
        return null
      }
    },

    submit: async (data: {
      quizId: string
      userId: string
      answers: number[]
      timeTaken: number
    }): Promise<SubmitResult | null> => {
      try {
        const res = await api.post<{ data: SubmitResult }>(USER_ROUTES.USER_QUIZ_ROUTES.SUBMIT, data)
        return res.data.data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to submit quiz : ${errorMessage}`)
        return null
      }
    }
  }
}