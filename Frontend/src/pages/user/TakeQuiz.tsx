// src/routes/user/TakeQuiz.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserService } from '@/services/user.service'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import type { QuizDetail } from '@/types/quiz'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

export default function TakeQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<QuizDetail>();
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const { user } = useSelector((s:RootState)=>s.auth);

  useEffect(() => {
    if (!id) return

    UserService.userQuizService.getById(id).then(quiz => {
      if (quiz) {
        setQuiz(quiz)
        setTimeLeft(quiz.timeLimit)
        setAnswers(new Array(quiz.questions.length).fill(-1))
      }
    })
  }, [id])

  useEffect(() => {
    if (!quiz || timeLeft <= 0) return

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }

  }, [quiz, timeLeft])


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleAnswer = (value: string) => {
    const idx = parseInt(value)
    const newAnswers = [...answers]
    newAnswers[current] = idx
    setAnswers(newAnswers)
  }

  const handleNext = () => setCurrent(c => Math.min(c + 1, (quiz?.questions.length || 0) - 1))
  const handlePrev = () => setCurrent(c => Math.max(c - 1, 0))

  const handleSubmit = async () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    const timeTaken = quiz ? quiz.timeLimit - timeLeft : 0
    const result = await UserService.userQuizService.submit({
      quizId: quiz ? quiz._id : "" ,
      userId: user?._id as string,
      answers,
      timeTaken
    })

    if (result) {
      navigate('/user/quiz-result', { 
        state: { 
          result, 
          quizTitle:quiz ? quiz.title : "",
          timeTaken 
        } 
      })
    }
  }

  if (!quiz) return <div className="p-8 text-center">Loading quiz...</div>

  const progress = ((current + 1) / quiz.questions.length) * 100
  const answered = answers.filter(a => a !== -1).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className={`text-lg font-mono px-3 py-1 rounded-full ${
            timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">
            Question {current + 1} of {quiz.questions.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Answered: {answered}/{quiz.questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6">{quiz.questions[current].question}</h2>
            <RadioGroup value={answers[current]?.toString()} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {quiz.questions[current].options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      answers[current] === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-ring'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={index.toString()} id={`q${current}-o${index}`} />
                      <Label
                        htmlFor={`q${current}-o${index}`}
                        className="flex-1 cursor-pointer py-3"
                      >
                        {option}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-8 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={current === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {current === quiz.questions.length - 1 ? (
          <Button onClick={() => setShowConfirm(true)} disabled={answered === 0}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answered} out of {quiz.questions.length} questions.
              <br />
              Time remaining: {formatTime(timeLeft)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}