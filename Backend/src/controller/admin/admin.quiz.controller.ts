import { HttpResponse } from "@/constants/response-message.constant";
import { IAdminQuizController } from "@/core/interface/controller/admin/Iadmin.quiz.controller";
import { IAdminQuizService } from "@/core/interface/service/admin/Iadmin.quiz.service";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";
import { NextFunction, Request, Response } from "express";

export class AdminQuizController implements IAdminQuizController {
  constructor(private readonly _service: IAdminQuizService) {}

  async getQuizzes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this._service.getQuizzes(req);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async createQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this._service.createQuiz(req);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_CREATED_SUCCESSFULLY);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async updateQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this._service.updateQuiz(req);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_UPDATED_SUCCESSFULLY);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async deleteQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this._service.deleteQuiz(req);
      ControllerErrorHandler.handleSuccess(res, null, HttpResponse.DATA_DELETED_SUCCESSFULLY);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async bulkDeleteQuizzes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this._service.bulkDeleteQuizzes(req);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_DELETED_SUCCESSFULLY);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}