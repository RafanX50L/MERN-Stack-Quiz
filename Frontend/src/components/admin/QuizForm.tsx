// src/components/admin/QuizForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'

type Question = {
  question: string
  options: string[]
  correctAnswer: number
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export default function QuizForm({ open, onClose, onSubmit, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Beginner')
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || 300)
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  )

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])
  }

  const handleQuestionChange = (idx: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    if (field === 'options') {
      updated[idx].options = value
    } else {
      // @ts-expect-error it is necessary
      updated[idx][field] = value
    }
    setQuestions(updated)
  }

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    onSubmit({ title, description, category, difficulty, timeLimit, questions })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Create'} Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Input value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Limit (seconds)</Label>
              <Input type="number" value={timeLimit} onChange={e => setTimeLimit(+e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Questions</Label>
              <Button size="sm" onClick={handleAddQuestion}>
                <Plus className="h-4 w-4 mr-1" /> Add Question
              </Button>
            </div>
            {questions.map((q, idx) => (
              <div key={idx} className="border p-4 rounded-lg space-y-3">
                <Input
                  placeholder="Question"
                  value={q.question}
                  onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, i) => (
                    <Input
                      key={i}
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={e => {
                        const opts = [...q.options]
                        opts[i] = e.target.value
                        handleQuestionChange(idx, 'options', opts)
                      }}
                    />
                  ))}
                </div>
                <Select
                  value={q.correctAnswer.toString()}
                  onValueChange={v => handleQuestionChange(idx, 'correctAnswer', +v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Correct Answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3].map(i => (
                      <SelectItem key={i} value={i.toString()}>
                        Option {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Quiz</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}