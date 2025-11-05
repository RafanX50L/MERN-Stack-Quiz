import { IQuizResult } from "@/models/QuizResult.model";
import { FilterQuery } from "mongoose";
import { IBaseRepository } from "./IBase.repository";

export interface IQuizResultRepository extends IBaseRepository<IQuizResult> {
  getTotalAttempts(): Promise<number>;
  getTotalUniqueUsers(): Promise<number>;
  getPlatformAvgScore(): Promise<number>;
  getAttemptsOverTime(): Promise<any[]>;
  getCategoryPerformance(): Promise<any[]>;
  getDifficultyBreakdown(): Promise<any[]>;
  getTopQuizzes(): Promise<any[]>;
  getUserGrowth(): Promise<any[]>;
  getUserResults(userId: string): Promise<IQuizResult[]>;
  getUserAttemptsOverTime(userId: string): Promise<any[]>;
  getUserCategoryPerformance(userId: string): Promise<any[]>;
}
