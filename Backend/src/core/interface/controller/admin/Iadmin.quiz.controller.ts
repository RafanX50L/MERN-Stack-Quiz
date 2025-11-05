import { NextFunction, Request, Response } from "express";

export interface IAdminQuizController {
    getQuizzes(req: Request, res: Response, next: NextFunction): Promise<void>;
    createQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
    bulkDeleteQuizzes(req: Request, res: Response, next: NextFunction): Promise<void>;
}