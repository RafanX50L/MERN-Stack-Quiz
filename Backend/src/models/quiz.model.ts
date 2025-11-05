import mongoose, { Schema, Document } from 'mongoose'
import { Question, QuizInput } from '@/types'

export interface IQuiz extends Document, Omit<QuizInput, 'questions'> {
  questions: Question[]
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<Question>({
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: [v => v.length === 4, 'Must have 4 options'] },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 }
})

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  timeLimit: { type: Number, required: true, min: 60 },
  questions: { type: [QuestionSchema], required: true, validate: [v => v.length > 0, 'At least one question'] }
}, { timestamps: true })

export default mongoose.model<IQuiz>('Quiz', QuizSchema)