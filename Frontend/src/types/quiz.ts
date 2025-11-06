export type QuizSummary = {
  _id: string
  title: string
  description: string
  category: string
  difficulty: string
  timeLimit: number
  questions: QuizDetail['questions'];
  questionCount: number
};

export type QuizDetail = {
  _id: string
  title: string
  timeLimit: number
  questions: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
};

export type SubmitResult = {
  success: boolean
  score: number
  correct: number
  total: number
  percentage: number
  timeTaken: number
  resultId: string
};