import { IQuiz } from "@/models/quiz.model";
import { Request } from "express";

export interface IAdminQuizService {
    getQuizzes(req: Request): Promise<{
        quizzes: IQuiz[];
        pagination: { page: number; limit: number; total: number };
    }>;
    createQuiz(req: Request): Promise<IQuiz>;
    updateQuiz(req: Request): Promise<IQuiz | null>;
    deleteQuiz(req: Request): Promise<void>;
    bulkDeleteQuizzes(req: Request): Promise<{ deletedCount: number }>;
}