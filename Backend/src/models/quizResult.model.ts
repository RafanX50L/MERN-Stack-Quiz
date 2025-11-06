import mongoose, { Schema, Document } from 'mongoose'
import { IQuiz } from './quiz.model'

export interface IQuizResult extends Document {
  quiz: mongoose.Types.ObjectId | IQuiz
  userId?: string
  score: number
  totalQuestions: number
  timeTaken: number
  answers: number[]
  createdAt: Date
  updatedAt: Date
}

const QuizResultSchema = new Schema<IQuizResult>({
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: String },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  answers: { type: [Number], required: true }
}, { timestamps: true })

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema)