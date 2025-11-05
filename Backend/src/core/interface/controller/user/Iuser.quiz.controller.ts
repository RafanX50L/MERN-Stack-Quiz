import { Request, Response, NextFunction } from 'express';

export interface IUserQuizController {
  getPublicQuizzes(req: Request, res: Response, next: NextFunction): Promise<void>;
  getQuizById(req: Request, res: Response, next: NextFunction): Promise<void>;
  submitQuizResult(req: Request, res: Response, next: NextFunction): Promise<void>;
}