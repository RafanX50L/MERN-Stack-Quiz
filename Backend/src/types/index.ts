export interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

export interface QuizInput {
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  timeLimit: number // seconds
  questions: Question[]
}

export interface QuizResultInput {
  quizId: string
  userId?: string // optional, can be anonymous
  answers: number[] // index of selected option per question
  timeTaken: number // seconds
}