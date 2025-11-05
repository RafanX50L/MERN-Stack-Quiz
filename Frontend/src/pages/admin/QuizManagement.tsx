// src/routes/admin/Quizzes.tsx
'use client'

import { useEffect, useState } from 'react'
import { AdminService, type Quiz } from '@/services/admin.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Pencil, Trash2, Search, Plus } from 'lucide-react'
import QuizForm from '@/components/admin/QuizForm'

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const loadQuizzes = async () => {
    const res = await AdminService.AdminQuizService.getAll({
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
  }

  useEffect(() => {
    loadQuizzes()
  }, [search, category, difficulty, pagination.page])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quiz?')) return
    await AdminService.AdminQuizService.delete(id)
    loadQuizzes()
  }

  const handleBulkDelete = async () => {
    if (!selected.length || !confirm(`Delete ${selected.length} quizzes?`)) return
    await AdminService.AdminQuizService.bulkDelete(selected)
    setSelected([])
    loadQuizzes()
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setFormOpen(true)
  }

  const handleSubmit = async (data: any) => {
    if (editingQuiz) {
      await AdminService.AdminQuizService.update(editingQuiz._id, data)
    } else {
      await AdminService.AdminQuizService.create(data)
    }
    setEditingQuiz(null)
    loadQuizzes()
  }

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Manage Quizzes
        </h1>
        <Button onClick={() => { setEditingQuiz(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Create Quiz
        </Button>
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
        <Select
          value={category || 'all'}
          onValueChange={value => setCategory(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* ✅ changed from "" to "all" */}
            <SelectItem value="Programming">Programming</SelectItem>
            <SelectItem value="Database">Database</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={difficulty || 'all'}
          onValueChange={value => setDifficulty(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* ✅ changed from "" to "all" */}
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        {selected.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete ({selected.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selected.length === quizzes.length && quizzes.length > 0}
                  onCheckedChange={checked => {
                    if (checked) setSelected(quizzes.map(q => q._id))
                    else setSelected([])
                  }}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map(quiz => (
              <TableRow key={quiz._id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(quiz._id)}
                    onCheckedChange={checked => {
                      if (checked) setSelected([...selected, quiz._id])
                      else setSelected(selected.filter(id => id !== quiz._id))
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{quiz.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={difficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                </TableCell>
                <TableCell>{quiz.questions.length}</TableCell>
                <TableCell>{Math.floor(quiz.timeLimit / 60)} min</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(quiz)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(quiz._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
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

      <QuizForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingQuiz(null) }}
        onSubmit={handleSubmit}
        initialData={editingQuiz}
      />
    </div>
  )
}