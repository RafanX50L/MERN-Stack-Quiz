import {  Document, ObjectId } from 'mongoose';

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user";
  isBlocked: boolean;
  quizzesTaken: number;
  avgScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;