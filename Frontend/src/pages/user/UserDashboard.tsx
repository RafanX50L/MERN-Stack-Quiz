// src/routes/user/Dashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { UserService, type UserDashboardData } from '@/services/user.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Trophy, Target, TrendingUp } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

export default function UserDashboard() {
  const [data, setData] = useState<UserDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const {user} = useSelector((s:RootState)=>s.auth);

  useEffect(() => {
    UserService.getDashboard(user?._id as string).then(res => {
      setData(res)
      setLoading(false)
    })
  }, [user?._id])

  if (loading) return <div className="p-8 text-center">Loading your dashboard...</div>
  if (!data) return <div className="p-8 text-center text-red-600">Failed to load data</div>

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Dashboard
        </h1>
        <p className="text-muted-foreground">Track your quiz performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                <p className="text-3xl font-bold">{data.stats.totalQuizzes}</p>
              </div>
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{data.stats.avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Score</p>
                <p className="text-3xl font-bold">{data.stats.bestScore}%</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attempts Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Attempts (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.charts.attemptsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.charts.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.charts.categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentResults.map((r, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.category} • {r.date}</p>
                </div>
                <p className={`text-2xl font-bold ${r.score >= 80 ? 'text-green-600' : r.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {r.score}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}