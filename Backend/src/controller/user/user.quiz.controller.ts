import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';
import { HttpResponse } from '@/constants/response-message.constant';
import { Request, Response, NextFunction } from 'express';
import { IUserQuizController } from '@/core/interface/controller/user/Iuser.quiz.controller';
import { IUserQuizService } from '@/core/interface/service/user/Iuser.quiz..service';

export class UserQuizController implements IUserQuizController {
  constructor(private readonly _service: IUserQuizService) {}

  async getPublicQuizzes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, difficulty, search, page = 1, limit = 10 } = req.query;
      const data = await this._service.getPublicQuizzes(
        { category: category as string, difficulty: difficulty as string, search: search as string },
        +page,
        +limit
      );
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getQuizById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this._service.getQuizById(req.params.id);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error: any) {
      if (error.message === 'Quiz not found') {
        return void res.status(404).json({ error: 'Quiz not found' });
      }
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async submitQuizResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quizId, userId, answers, timeTaken } = req.body;
      if (!quizId || !userId || !answers) {
        return void res.status(400).json({ error: 'Missing required fields' });
      }

      const data = await this._service.submitQuizResult(quizId, userId, answers, timeTaken);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_SUBMITTED_SUCCESSFULLY);
    } catch (error: any) {
      if (error.message === 'Quiz not found') {
        return void res.status(404).json({ error: 'Quiz not found' });
      }
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}