// src/services/adminDashboard.service.ts
import { ADMIN_ROUTES } from '@/constants/routes'
import { toast } from 'sonner'
import api from './api'
import type { UserInterface } from '@/types/user'

export type AdminDashboardData = {
  stats: {
    totalQuizzes: number
    totalAttempts: number
    totalUsers: number
    avgScore: number
  }
  charts: {
    attemptsOverTime: Array<{ date: string; attempts: number }>
    categoryPerformance: Array<{ category: string; attempts: number; avgScore: number }>
    difficultyBreakdown: Array<{ difficulty: string; count: number }>
    topQuizzes: Array<{ quiz: string; attempts: number; avgScore: number }>
    userGrowth: Array<{ date: string; users: number }>
  }
}
export type Quiz = {
  _id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  timeLimit: number
  questions: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
}

export type PaginatedQuizzes = {
  quizzes: Quiz[]
  pagination: { page: number; limit: number; total: number }
}
export type PaginatedUsers = {
  users: UserInterface[]
  pagination: { page: number; limit: number; total: number }
}
export const AdminService = {
  getDashboard: async (): Promise<AdminDashboardData | null> => {
    try {
      const res = await api.get<{ data: AdminDashboardData}>(ADMIN_ROUTES.DASHBOARD)
      return res.data.data
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to load admin dashboard'
      toast.error(msg)
      return null
    }
  },
  AdminQuizService: {
    getAll: async (params?: {
      search?: string
      category?: string
      difficulty?: string
      page?: number
      limit?: number
    }): Promise<PaginatedQuizzes | null> => {
      try {
        const searchParams = new URLSearchParams()
        if (params?.search) searchParams.append('search', params.search)
        if (params?.category) searchParams.append('category', params.category)
        if (params?.difficulty) searchParams.append('difficulty', params.difficulty)
        if (params?.page) searchParams.append('page', params.page.toString())
        if (params?.limit) searchParams.append('limit', params.limit.toString())

        const res = await api.get<{ data: PaginatedQuizzes }>(`${ADMIN_ROUTES.ADMIN_QUIZ_ROUTES.GET_ALL}?${searchParams}`)
        return res.data.data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to load quizzes : ${errorMessage}`)
        return null
      }
    },

    create: async (data: Omit<Quiz, '_id'>) => {
      try {
        const res = await api.post(ADMIN_ROUTES.ADMIN_QUIZ_ROUTES.CREATE, data)
        toast.success('Quiz created!')
        return res.data.data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to create quiz : ${errorMessage}`)
        throw error
      }
    },

    update: async (id: string, data: Partial<Quiz>) => {
      try {
        const res = await api.put(ADMIN_ROUTES.ADMIN_QUIZ_ROUTES.UPDATE(id), data)
        toast.success('Quiz updated!')
        return res.data.data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to update quiz : ${errorMessage}`)
        throw error
      }
    },

    delete: async (id: string) => {
      try {
        await api.delete(ADMIN_ROUTES.ADMIN_QUIZ_ROUTES.DELETE(id))
        toast.success('Quiz deleted!')
      } catch (error) {
        toast.error('Failed to delete')
        throw error
      }
    },

    bulkDelete: async (ids: string[]) => {
      try {
        await api.post(ADMIN_ROUTES.ADMIN_QUIZ_ROUTES.BULK_DELETE, { ids })
        toast.success(`${ids.length} quizzes deleted`)
      } catch (error) {
        toast.error('Bulk delete failed')
        throw error
      }
    }
  },
  AdminUserService: {
    getAll: async (params?: {
      search?: string
      role?: string
      status?: 'active' | 'blocked'
      page?: number
      limit?: number
    }): Promise<PaginatedUsers | null> => {
      try {
        const searchParams = new URLSearchParams()
        if (params?.search) searchParams.append('search', params.search)
        if (params?.role) searchParams.append('role', params.role)
        if (params?.status) searchParams.append('status', params.status)
        if (params?.page) searchParams.append('page', params.page.toString())
        if (params?.limit) searchParams.append('limit', params.limit.toString())

        const res = await api.get<{ data: PaginatedUsers}>(`${ADMIN_ROUTES.ADMIN_USER_ROUTES.GET_ALL}?${searchParams}`)
        return res.data.data
      } catch (error) {
        toast.error('Failed to load users')
        throw error;
      }
    },

    toggleBlock: async (id: string, isBlocked: boolean) => {
      try {
        await api.patch(ADMIN_ROUTES.ADMIN_USER_ROUTES.TOGGLE_BLOCK(id), { isBlocked })
        toast.success(isBlocked ? 'User blocked' : 'User unblocked')
      } catch (error) {
        toast.error('Failed to update status')
        throw error
      }
    },

    bulkToggleBlock: async (ids: string[], isBlocked: boolean) => {
      try {
        await api.post(ADMIN_ROUTES.ADMIN_USER_ROUTES.BULK_BLOCK, { ids, isBlocked })
        toast.success(`${ids.length} users ${isBlocked ? 'blocked' : 'unblocked'}`)
      } catch (error) {
        toast.error('Bulk action failed')
        throw error
      }
    }
  }

}